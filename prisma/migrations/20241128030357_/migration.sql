-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reply" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "topicId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Reply_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reply" ("content", "createdAt", "id", "topicId", "userId") SELECT "content", "createdAt", "id", "topicId", "userId" FROM "Reply";
DROP TABLE "Reply";
ALTER TABLE "new_Reply" RENAME TO "Reply";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
