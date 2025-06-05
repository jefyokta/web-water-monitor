<?php

namespace App\Service;

use Swoole\Table;
/**
 * 
 */
class Preference
{
    private static ?Table $table = null;

    public static function create(): void
    {
        if (self::$table !== null) {
            return;
        }

        $table = new Table(4096); 
        $table->column("name", Table::TYPE_STRING, 64);  
        $table->column("value", Table::TYPE_STRING, 256); 
        $table->create();

        self::$table = $table;
    }

    public static function set(string $key, string $value): void
    {
        self::ensureCreated();
        self::$table->set($key, [
            'name' => $key,
            'value' => $value,
        ]);
    }

    public static function get(string $key): ?string
    {
        self::ensureCreated();
        $row = self::$table->get($key);
        return $row['value'] ?? null;
    }

    public static function has(string $key): bool
    {
        self::ensureCreated();
        return self::$table->exist($key);
    }

    private static function ensureCreated(): void
    {
        if (self::$table === null) {
            throw new \RuntimeException("Preference table not created. Call Preference::create() first.");
        }
    }

    public static function table(): ?Table
    {
        return self::$table;
    }
}
