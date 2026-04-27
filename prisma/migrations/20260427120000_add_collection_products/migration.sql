-- Rename existing collection columns to preserve data
ALTER TABLE "Collection" RENAME COLUMN "name" TO "title";
ALTER TABLE "Collection" RENAME COLUMN "image" TO "coverImage";

-- Add new collection media fields
ALTER TABLE "Collection"
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "mediaType" TEXT NOT NULL DEFAULT 'image',
ADD COLUMN     "thumbnail" TEXT;

-- Preserve existing storefront media for migrated rows
UPDATE "Collection"
SET
  "mediaUrl" = COALESCE("mediaUrl", "coverImage"),
  "thumbnail" = COALESCE("thumbnail", "coverImage")
WHERE "coverImage" IS NOT NULL;

-- Create collection-product join table
CREATE TABLE "CollectionProduct" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CollectionProduct_collectionId_productId_key" ON "CollectionProduct"("collectionId", "productId");

ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionProduct" ADD CONSTRAINT "CollectionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
