import { redirect } from 'next/navigation'
import { CartItem } from '@/models/User'
import { getCart } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { Product } from '@/models/Product'
import { Types } from 'mongoose'

