/*
  Warnings:

  - You are about to drop the column `genre` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `genres` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runTime` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imdbId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "releaseYear" INTEGER NOT NULL,
    "genres" TEXT NOT NULL,
    "runTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Movie" ("createdAt", "description", "id", "releaseYear", "title") SELECT "createdAt", "description", "id", "releaseYear", "title" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
