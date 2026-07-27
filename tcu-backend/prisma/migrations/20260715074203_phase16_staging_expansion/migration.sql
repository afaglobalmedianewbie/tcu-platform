-- CreateEnum
CREATE TYPE "VirusScanStatus" AS ENUM ('PENDING', 'CLEAN', 'INFECTED');

-- CreateEnum
CREATE TYPE "StorageDriver" AS ENUM ('LOCAL', 'S3');

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storageDriver" "StorageDriver" NOT NULL DEFAULT 'LOCAL',
    "storagePath" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "virusScanStatus" "VirusScanStatus" NOT NULL DEFAULT 'PENDING',
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileVersion" (
    "id" TEXT NOT NULL,
    "fileAssetId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "virusScanStatus" "VirusScanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "CmsTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverAssetId" TEXT,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CmsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsPostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "CmsPostTag_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "AutoPostJob" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "isExecuted" BOOLEAN NOT NULL DEFAULT false,
    "executedAt" TIMESTAMP(3),
    "targetChannels" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoPostJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KbCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "KbArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbVersion" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KbFeedback" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT,
    "isHelpful" BOOLEAN NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KbFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileAsset_ownerId_idx" ON "FileAsset"("ownerId");

-- CreateIndex
CREATE INDEX "FileAsset_virusScanStatus_idx" ON "FileAsset"("virusScanStatus");

-- CreateIndex
CREATE INDEX "FileAsset_deletedAt_idx" ON "FileAsset"("deletedAt");

-- CreateIndex
CREATE INDEX "FileVersion_fileAssetId_idx" ON "FileVersion"("fileAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_fileAssetId_versionNumber_key" ON "FileVersion"("fileAssetId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CmsCategory_name_key" ON "CmsCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CmsCategory_slug_key" ON "CmsCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CmsTag_name_key" ON "CmsTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CmsTag_slug_key" ON "CmsTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CmsPost_slug_key" ON "CmsPost"("slug");

-- CreateIndex
CREATE INDEX "CmsPost_categoryId_idx" ON "CmsPost"("categoryId");

-- CreateIndex
CREATE INDEX "CmsPost_authorId_idx" ON "CmsPost"("authorId");

-- CreateIndex
CREATE INDEX "CmsPost_isPublished_idx" ON "CmsPost"("isPublished");

-- CreateIndex
CREATE INDEX "CmsPost_deletedAt_idx" ON "CmsPost"("deletedAt");

-- CreateIndex
CREATE INDEX "CmsPostTag_postId_idx" ON "CmsPostTag"("postId");

-- CreateIndex
CREATE INDEX "CmsPostTag_tagId_idx" ON "CmsPostTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "AutoPostJob_postId_key" ON "AutoPostJob"("postId");

-- CreateIndex
CREATE INDEX "AutoPostJob_scheduledFor_idx" ON "AutoPostJob"("scheduledFor");

-- CreateIndex
CREATE INDEX "AutoPostJob_isExecuted_idx" ON "AutoPostJob"("isExecuted");

-- CreateIndex
CREATE UNIQUE INDEX "KbCategory_name_key" ON "KbCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KbCategory_slug_key" ON "KbCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "KbArticle_slug_key" ON "KbArticle"("slug");

-- CreateIndex
CREATE INDEX "KbArticle_categoryId_idx" ON "KbArticle"("categoryId");

-- CreateIndex
CREATE INDEX "KbArticle_authorId_idx" ON "KbArticle"("authorId");

-- CreateIndex
CREATE INDEX "KbArticle_isInternal_idx" ON "KbArticle"("isInternal");

-- CreateIndex
CREATE INDEX "KbArticle_deletedAt_idx" ON "KbArticle"("deletedAt");

-- CreateIndex
CREATE INDEX "KbVersion_articleId_idx" ON "KbVersion"("articleId");

-- CreateIndex
CREATE INDEX "KbVersion_authorId_idx" ON "KbVersion"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "KbVersion_articleId_versionNum_key" ON "KbVersion"("articleId", "versionNum");

-- CreateIndex
CREATE INDEX "KbFeedback_articleId_idx" ON "KbFeedback"("articleId");

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPost" ADD CONSTRAINT "CmsPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CmsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPost" ADD CONSTRAINT "CmsPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPostTag" ADD CONSTRAINT "CmsPostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CmsPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPostTag" ADD CONSTRAINT "CmsPostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "CmsTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoPostJob" ADD CONSTRAINT "AutoPostJob_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CmsPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbArticle" ADD CONSTRAINT "KbArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "KbCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbArticle" ADD CONSTRAINT "KbArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbVersion" ADD CONSTRAINT "KbVersion_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KbArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbVersion" ADD CONSTRAINT "KbVersion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbFeedback" ADD CONSTRAINT "KbFeedback_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KbArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KbFeedback" ADD CONSTRAINT "KbFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
