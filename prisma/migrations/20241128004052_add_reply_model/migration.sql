-- DropIndex
DROP INDEX "Category_name_key";

-- CreateTable
CREATE TABLE "Reply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Reply_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
