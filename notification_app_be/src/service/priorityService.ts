// notification_app_be/src/service/priorityService.ts
// Stage 6: Priority Inbox Algorithm
// Priority = type_weight * 10 + recency_score
// recency_score = 10 * e^(-hours_elapsed / 24)
// Uses a min-heap to efficiently maintain top-N notifications

import { Log } from "../../../logging_middleware/src/index";
import { Notification, PriorityNotification, TYPE_WEIGHTS, NotificationType } from "../domain/notification";

/**
 * Calculate priority score for a notification.
 * Higher = more important.
 */
function calculatePriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHTS[notification.Type as NotificationType] ?? 1;
  const createdAt = new Date(notification.Timestamp).getTime();
  const hoursElapsed = (Date.now() - createdAt) / (1000 * 60 * 60);
  const recencyScore = 10 * Math.exp(-hoursElapsed / 24);
  return weight * 10 + recencyScore;
}

/**
 * Min-Heap implementation for top-N priority notifications.
 * Keeps the N highest-scoring notifications efficiently.
 */
class MinHeap {
  private heap: PriorityNotification[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  private parent(i: number) { return Math.floor((i - 1) / 2); }
  private left(i: number) { return 2 * i + 1; }
  private right(i: number) { return 2 * i + 2; }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(i: number) {
    while (i > 0 && this.heap[this.parent(i)].priorityScore > this.heap[i].priorityScore) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private heapifyDown(i: number) {
    let smallest = i;
    const l = this.left(i), r = this.right(i);
    if (l < this.heap.length && this.heap[l].priorityScore < this.heap[smallest].priorityScore)
      smallest = l;
    if (r < this.heap.length && this.heap[r].priorityScore < this.heap[smallest].priorityScore)
      smallest = r;
    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapifyDown(smallest);
    }
  }

  insert(item: PriorityNotification) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this.heapifyUp(this.heap.length - 1);
    } else if (item.priorityScore > this.heap[0].priorityScore) {
      // Replace the lowest priority item
      this.heap[0] = item;
      this.heapifyDown(0);
    }
  }

  getTopN(): PriorityNotification[] {
    return [...this.heap].sort((a, b) => b.priorityScore - a.priorityScore);
  }
}

/**
 * Get top N priority notifications from the full list.
 * O(n log N) time complexity — efficient even for large datasets.
 */
export function getTopNPriorityNotifications(
  notifications: Notification[],
  n: number
): PriorityNotification[] {
  Log("backend", "info", "service", `Computing top ${n} priority notifications from ${notifications.length} total`);

  const heap = new MinHeap(n);

  for (const notification of notifications) {
    const score = calculatePriorityScore(notification);
    heap.insert({ ...notification, priorityScore: parseFloat(score.toFixed(4)) });
  }

  const result = heap.getTopN();
  Log("backend", "info", "service", `Top ${n} notifications computed. Highest score: ${result[0]?.priorityScore}`);
  return result;
}
