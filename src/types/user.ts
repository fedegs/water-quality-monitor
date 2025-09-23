export type User = {
  id: number
  username: string
  active: boolean
  role: string
  is_superuser: boolean
  first_name: string
  last_name: string
  document_type?: string | null
  document_number?: string | null
  address_line1: string
  address_line2: string
  city: string
  state_province: string
  postal_code: string
  country: string
  email: string
  phone: string
  organization?: string | null
  department?: string | null
  position_title?: string | null
  created_at: string
  created_by_user_id?: number | null
  updated_at: string
  updated_by_user_id?: number | null
  last_login_at?: string | null
}