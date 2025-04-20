-- CreateTable
CREATE TABLE "Stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "focusTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pomodoroTime" INTEGER NOT NULL DEFAULT 25,
    "shortBreakTime" INTEGER NOT NULL DEFAULT 5,
    "longBreakTime" INTEGER NOT NULL DEFAULT 15,
    "autoStartBreaks" BOOLEAN NOT NULL DEFAULT false,
    "autoStartPomodoros" BOOLEAN NOT NULL DEFAULT false,
    "longBreakInterval" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stats_userId_idx" ON "Stats"("userId");

-- CreateIndex
CREATE INDEX "Stats_date_idx" ON "Stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_date_key" ON "Stats"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
