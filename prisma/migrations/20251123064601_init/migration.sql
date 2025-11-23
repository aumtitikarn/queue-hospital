-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "queue_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "queueNumber" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "departmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "queue_tickets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "queue_tickets_departmentId_idx" ON "queue_tickets"("departmentId");

-- CreateIndex
CREATE INDEX "queue_tickets_status_idx" ON "queue_tickets"("status");
