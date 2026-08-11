-- Migration: Add merchant ownership column to customers table
-- Description: Adds created_by_admin_id column to track which admin created each merchant/customer
-- Date: 2026-08-10

-- Add created_by_admin_id column as nullable UUID
ALTER TABLE public.customers
ADD COLUMN created_by_admin_id UUID NULL;

-- Add foreign key constraint referencing admins(id)
ALTER TABLE public.customers
ADD CONSTRAINT customers_created_by_admin_id_fkey
FOREIGN KEY (created_by_admin_id)
REFERENCES public.admins(id)
ON DELETE SET NULL;

-- Add index for efficient lookups by admin
CREATE INDEX customers_created_by_admin_id_idx
ON public.customers(created_by_admin_id);