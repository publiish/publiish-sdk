import { Brand } from './brand.entity.js';

export const BRAND_MOCK: Brand = {
  id: 1,
  brand_name: 'brand name',
  brand_url: 'http://brand.com',
  dao_id: 1,
  write_permission: true,
  delete_permission: true,
  email: 'brand@email.com',
  sub_domain: 'http://sub.brand.com',
  apikeys: [],
  toJSON: () => [],
};
