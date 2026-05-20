import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { fetchOpenRouterModels, normalizeOpenRouterModel } from './openrouter.service'
import { searchHFModels, normalizeHFModel } from './huggingface.service'
import { fetchRSSFeeds, normalizeRSSNews } from './news-rss.service'
import { fetchNewsAPI, normalizeNewsAPI } from './news-api.service'
import { fetchLMSYSLeaderboard, getLMSYSCategories, normalizeLMSYSToModelId } from './lmsys.service'

const SYNC_CRON = process.env.SYNC_CRON_EXPRESSION || '0 2 * * *'

let schedulerPrisma: PrismaClient | null = null

export function startSyncScheduler(prisma: PrismaClient) {
  schedulerPrisma = prisma
  console.log(`Starting sync scheduler with cron: ${SYNC_CRON}`)
  
  cron.schedule(SYNC_CRON, async () => {
    console.log('Running scheduled sync...')
    await syncAll()
  })

  console.log('Sync scheduler started')
}

export async function syncAll() {
  if (!schedulerPrisma) throw new Error('Sync scheduler not initialized')
  
  const startTime = Date.now()
  let itemsUpdated = 0
  let errors: string[] = []

  try {
    itemsUpdated += await syncModels()
    itemsUpdated += await syncNews()
    itemsUpdated += await syncLeaderboard()
    
    await schedulerPrisma.syncLog.create({
      data: {
        jobName: 'full-sync',
        itemsUpdated,
        status: 'success',
        ranAt: new Date()
      }
    })

    console.log(`Sync completed in ${Date.now() - startTime}ms. Updated ${itemsUpdated} items.`)
    return { success: true, itemsUpdated, duration: Date.now() - startTime }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    errors.push(errorMsg)
    
    await schedulerPrisma.syncLog.create({
      data: {
        jobName: 'full-sync',
        itemsUpdated,
        errors: errors.join('\n'),
        status: 'error',
        ranAt: new Date()
      }
    })

    console.error('Sync failed:', error)
    return { success: false, itemsUpdated, errors }
  }
}

async function syncModels(): Promise<number> {
  if (!schedulerPrisma) throw new Error('Sync scheduler not initialized')
  
  let updated = 0

  try {
    const orModels = await fetchOpenRouterModels()
    
    for (const or of orModels) {
      const normalized = normalizeOpenRouterModel(or)
      
      const existing = await schedulerPrisma.model.findFirst({
        where: { OR: [
          { openrouterId: or.id },
          { name: normalized.name }
        ]}
      })

      if (existing) {
        await schedulerPrisma.model.update({
          where: { id: existing.id },
          data: {
            contextWindow: normalized.contextWindow,
            maxOutputTokens: normalized.maxOutputTokens,
            pricing: normalized.pricingInput ? `$${normalized.pricingInput}/$${normalized.pricingOutput} per 1M tokens` : existing.pricing,
            apiAvailable: true,
          }
        })
        updated++
      } else {
        await schedulerPrisma.model.create({
          data: {
            id: or.id.replace(/\//g, '-'),
            name: normalized.name,
            organization: or.id.split('/')[0] || 'Unknown',
            version: or.id.split('/')[1] || '1.0',
            description: normalized.description,
            contextWindow: normalized.contextWindow,
            maxOutputTokens: normalized.maxOutputTokens,
            pricing: normalized.pricingInput ? `$${normalized.pricingInput}/$${normalized.pricingOutput} per 1M tokens` : null,
            license: 'Unknown',
            isOpenSource: false,
            apiAvailable: true,
            openrouterId: or.id,
            status: 'Available',
            modalitiesInput: '[]',
            modalitiesOutput: '[]',
            strengths: '[]',
            hfTags: '[]',
            quantizationFormats: '[]',
          }
        })
        updated++
      }
    }
  } catch (error) {
    console.error('Error syncing OpenRouter models:', error)
  }

  try {
    const hfModels = await searchHFModels('llm')
    
    for (const hf of hfModels.slice(0, 30)) {
      const normalized = normalizeHFModel(hf)
      
      const existing = await schedulerPrisma.model.findFirst({
        where: { huggingfaceRepo: normalized.huggingfaceRepo }
      })

      if (existing) {
        await schedulerPrisma.model.update({
          where: { id: existing.id },
          data: {
            hfDownloads: normalized.hfDownloads,
            hfLikes: normalized.hfLikes,
            hfTags: JSON.stringify(normalized.hfTags),
            isOpenSource: normalized.isOpenSource,
          }
        })
        updated++
      }
    }
  } catch (error) {
    console.error('Error syncing HF models:', error)
  }

  return updated
}

async function syncNews(): Promise<number> {
  if (!schedulerPrisma) throw new Error('Sync scheduler not initialized')
  
  let updated = 0

  try {
    const rssItems = await fetchRSSFeeds()
    
    for (const item of rssItems.slice(0, 30)) {
      const normalized = normalizeRSSNews(item)
      
      const existing = await schedulerPrisma.newsItem.findFirst({
        where: { url: normalized.url }
      })

      if (!existing) {
        await schedulerPrisma.newsItem.create({
          data: {
            ...normalized,
            tags: JSON.stringify(normalized.tags),
          }
        })
        updated++
      }
    }
  } catch (error) {
    console.error('Error syncing RSS news:', error)
  }

  try {
    const newsApiItems = await fetchNewsAPI()
    
    for (const item of newsApiItems.slice(0, 30)) {
      const normalized = normalizeNewsAPI(item)
      
      const existing = await schedulerPrisma.newsItem.findFirst({
        where: { url: normalized.url }
      })

      if (!existing) {
        await schedulerPrisma.newsItem.create({
          data: {
            ...normalized,
            tags: JSON.stringify(normalized.tags),
          }
        })
        updated++
      }
    }
  } catch (error) {
    console.error('Error syncing NewsAPI:', error)
  }

  return updated
}

async function syncLeaderboard(): Promise<number> {
  if (!schedulerPrisma) throw new Error('Sync scheduler not initialized')
  
  let updated = 0
  const categories = getLMSYSCategories()

  for (const cat of categories) {
    try {
      const entries = await fetchLMSYSLeaderboard(cat)
      
      for (const entry of entries) {
        await schedulerPrisma.leaderboardEntry.upsert({
          where: {
            modelName_category: {
              modelName: entry.model,
              category: cat,
            }
          },
          update: {
            arenaScore: entry.arenaScore,
            ci95Lower: entry.ci95[0],
            ci95Upper: entry.ci95[1],
            votes: entry.votes,
            organization: entry.organization,
            license: entry.license,
            rank: entry.rank,
            modelId: normalizeLMSYSToModelId(entry.model),
            lastUpdated: new Date(),
          },
          create: {
            modelName: entry.model,
            modelId: normalizeLMSYSToModelId(entry.model),
            arenaScore: entry.arenaScore,
            ci95Lower: entry.ci95[0],
            ci95Upper: entry.ci95[1],
            votes: entry.votes,
            organization: entry.organization,
            license: entry.license,
            rank: entry.rank,
            category: cat,
            lastUpdated: new Date(),
          }
        })
        updated++
      }
    } catch (error) {
      console.error(`Error syncing LMSYS leaderboard (${cat}):`, error)
    }
  }

  return updated
}
