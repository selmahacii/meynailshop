'use client';

import { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants/orderStatuses';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface AdminOrdersTableProps {
  orders: Order[];
  loading?: boolean;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  pagination?: {
    page: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function AdminOrdersTable({
  orders,
  loading = false,
  onView,
  onEdit,
  onDelete,
  pagination,
}: AdminOrdersTableProps) {
  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Numéro de commande',
      width: '20%',
    },
    {
      key: 'user',
      label: 'Client',
      width: '25%',
      render: (value, row) => {
        if (value) {
          return `${value.firstName} ${value.lastName}`;
        }
        return '-';
      },
    },
    {
      key: 'total',
      label: 'Total',
      width: '15%',
      render: (value) => formatPrice(value),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '20%',
      render: (value) => {
        const color = ORDER_STATUS_COLORS[value as keyof typeof ORDER_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
        const label = ORDER_STATUS_LABELS[value as keyof typeof ORDER_STATUS_LABELS] || value;
        return (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${color}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      width: '20%',
      render: (value) => formatDate(value),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={loading}
      pagination={pagination}
      actions={(row) => (
        <div className="flex gap-2 justify-end">
          {onView && (
            <button
              onClick={() => onView(row)}
              className="p-2 text-or hover:bg-or/10 rounded transition"
              title="Voir"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-2 text-rouge hover:bg-rouge/10 rounded transition"
              title="Modifier"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
                  onDelete(row);
                }
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    />
  );
}
