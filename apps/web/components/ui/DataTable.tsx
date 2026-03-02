'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  actions?: (row: T) => ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  onRowClick,
  pagination,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-creme2">
        <table className="w-full">
          <thead className="bg-creme2 border-b border-creme2">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-3 text-left text-sm font-outfit font-semibold text-encre"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right text-sm font-outfit font-semibold">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-2 h-2 bg-rouge rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-rouge rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-rouge rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-encre3">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-creme2 hover:bg-creme2 transition',
                    onRowClick && 'cursor-pointer',
                    idx % 2 === 1 && 'bg-creme/50',
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-4 text-sm text-encre">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key] || '-')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-encre3">
            Page {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)} ({pagination.total} résultats)
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="p-2 hover:bg-creme2 disabled:opacity-50 rounded transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              className="p-2 hover:bg-creme2 disabled:opacity-50 rounded transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
