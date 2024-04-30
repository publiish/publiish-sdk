import { Brand } from 'src/brand/brand.entity.js';

export const isInvalidEndpoint = (brand: Brand, referer?: string) =>
  brand.sub_domain && referer && !referer.startsWith(brand.sub_domain);
