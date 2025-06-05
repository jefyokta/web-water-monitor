<?php

/**
 * 
 * ffi filewatcher
 */
class FFI
{

    function watchDir(string $dir) {}
    function waitForChanges(int $ms): int
    {
        return 0;
    }
}

namespace Swoole;

/**
 * @template TResource
 */
class ConnectionPool
{
    /**
     * @param callable(): TResource $constructor
     * @param int $size
     */
    public function __construct(callable $constructor, int $size = 64) {}

    /**
     * Fill the pool with connections.
     * @return bool
     */
    public function fill(): bool
    {
        return true;
    }

    /**
     * Get a connection from the pool.
     * @return TResource|null
     */
    public function get() {}

    /**
     * Put a connection back to the pool.
     * @param TResource $connection
     * @return void
     */
    public function put($connection): void {}

    /**
     * Close the pool and release all resources.
     * @return void
     */
    public function close(): void {}
}

namespace Swoole\Coroutine;

class WaitGroup
{
    function add() {}
    function done() {}
    function wait() {}
}
