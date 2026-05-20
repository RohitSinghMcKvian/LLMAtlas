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
    "modalitiesInput" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modalitiesOutput" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    "quantizationFormats" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "selfHostable" BOOLEAN NOT NULL DEFAULT false,
    "pricing" TEXT,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'Available',
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "family" TEXT,
    "apiAvailable" BOOLEAN NOT NULL DEFAULT true,
    "openrouterId" TEXT,
    "hfDownloads" INTEGER NOT NULL DEFAULT 0,
    "hfLikes" INTEGER NOT NULL DEFAULT 0,
    "hfTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    "whyItMatters" TEXT,
    "limitations" TEXT,
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
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    "bookmarks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recentViews" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

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
CREATE INDEX "NewsItem_tags_idx" ON "NewsItem"("tags");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_type_itemId_key" ON "Bookmark"("userId", "type", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelVersion" ADD CONSTRAINT "ModelVersion_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

