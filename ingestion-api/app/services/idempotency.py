from __future__ import annotations

from collections import OrderedDict

from app.schemas.telemetry import BatchAcceptedResponse

IdempotencyKey = tuple[str, int]


class IdempotencyCache:
    """Bounded FIFO cache for batch accept responses keyed by (sessionId, batchSequence)."""

    def __init__(self, *, max_entries: int) -> None:
        if max_entries < 1:
            raise ValueError("max_entries must be >= 1")
        self._max_entries = max_entries
        self._entries: OrderedDict[IdempotencyKey, BatchAcceptedResponse] = OrderedDict()

    @property
    def max_entries(self) -> int:
        return self._max_entries

    @property
    def size(self) -> int:
        return len(self._entries)

    def get(self, key: IdempotencyKey) -> BatchAcceptedResponse | None:
        return self._entries.get(key)

    def put(self, key: IdempotencyKey, response: BatchAcceptedResponse) -> None:
        # Cập nhật key cũ không tăng size; chỉ eviction khi thêm key mới vượt max.
        if key in self._entries:
            self._entries.move_to_end(key)
            self._entries[key] = response
            return

        while len(self._entries) >= self._max_entries:
            self._entries.popitem(last=False)
        self._entries[key] = response
