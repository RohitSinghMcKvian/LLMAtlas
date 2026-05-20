-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "models" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "modelId" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT NOT NULL,
    "parameters" TEXT,
    "activeParameters" TEXT,
    "architecture" TEXT,
    "contextWindow" INTEGER NOT NULL DEFAULT 128000,
    "maxOutputTokens" INTEGER NOT NULL DEFAULT 4096,
    "trainingCutoff" TEXT,
    "trainingTokens" TEXT,
    "modalitiesInput" TEXT NOT NULL DEFAULT '[]',
    "modalitiesOutput" TEXT NOT NULL DEFAULT '[]',
    "languagesSupported" TEXT,
    "toolUse" TEXT NOT NULL DEFAULT 'No',
    "systemPrompt" TEXT NOT NULL DEFAULT 'Supported',
    "fineTuning" TEXT NOT NULL DEFAULT 'Not available',
    "license" TEXT NOT NULL,
    "releaseDate" TEXT,
    "organizationLink" TEXT,
    "apiEndpoint" TEXT,
    "huggingfaceRepo" TEXT,
    "github" TEXT,
    "paper" TEXT,
    "vramBF16" TEXT,
    "vramQ4" TEXT,
    "quantizationFormats" TEXT NOT NULL DEFAULT '[]',
    "selfHostable" BOOLEAN NOT NULL DEFAULT false,
    "pricing" TEXT,
    "strengths" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'Available',
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "family" TEXT,
    "apiAvailable" BOOLEAN NOT NULL DEFAULT true,
    "openrouterId" TEXT,
    "hfDownloads" INTEGER NOT NULL DEFAULT 0,
    "hfLikes" INTEGER NOT NULL DEFAULT 0,
    "hfTags" TEXT NOT NULL DEFAULT '[]',
    "pricingInput" DOUBLE PRECISION,
    "pricingOutput" DOUBLE PRECISION,
    "libraryName" TEXT,
    "pipelineTag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "limitations" TEXT NOT NULL,
    "methodologyUrl" TEXT,
    "scoreType" TEXT NOT NULL DEFAULT 'percentage',
    "higherIsBetter" BOOLEAN NOT NULL DEFAULT true,
    "scaleMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scaleMax" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkScore" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "runCount" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL DEFAULT 'Official',
    "evalDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BenchmarkScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelVersion" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "releaseDate" TEXT,
    "changelog" TEXT,
    "deprecatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceIcon" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemsUpdated" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillLevel" TEXT,
    "bookmarks" TEXT NOT NULL DEFAULT '[]',
    "recentViews" TEXT NOT NULL DEFAULT '[]',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelId" TEXT,
    "organization" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'text',
    "arenaScore" DOUBLE PRECISION NOT NULL,
    "ci95Lower" DOUBLE PRECISION NOT NULL,
    "ci95Upper" DOUBLE PRECISION NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "license" TEXT NOT NULL DEFAULT 'Unknown',
    "rank" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_order_idx" ON "Message"("order");

-- CreateIndex
CREATE INDEX "Model_organization_idx" ON "Model"("organization");

-- CreateIndex
CREATE INDEX "Model_license_idx" ON "Model"("license");

-- CreateIndex
CREATE INDEX "Model_status_idx" ON "Model"("status");

-- CreateIndex
CREATE INDEX "Benchmark_category_idx" ON "Benchmark"("category");

-- CreateIndex
CREATE INDEX "BenchmarkScore_modelId_idx" ON "BenchmarkScore"("modelId");

-- CreateIndex
CREATE INDEX "BenchmarkScore_benchmarkId_idx" ON "BenchmarkScore"("benchmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "BenchmarkScore_modelId_benchmarkId_key" ON "BenchmarkScore"("modelId", "benchmarkId");

-- CreateIndex
CREATE INDEX "ModelVersion_modelId_idx" ON "ModelVersion"("modelId");

-- CreateIndex
CREATE INDEX "NewsItem_publishedAt_idx" ON "NewsItem"("publishedAt");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_type_itemId_key" ON "Bookmark"("userId", "type", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_category_idx" ON "LeaderboardEntry"("category");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_organization_idx" ON "LeaderboardEntry"("organization");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_rank_idx" ON "LeaderboardEntry"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_modelName_category_key" ON "LeaderboardEntry"("modelName", "category");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelVersion" ADD CONSTRAINT "ModelVersion_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

