import { INestApplication } from '@nestjs/common';

// Initializes AdminJS with TypeORM resources and sensible defaults.
// Uses runtime `require()` so compiled CommonJS output can load ESM-style packages.
export async function initAdmin(app: INestApplication) {
  try {
    // Load AdminJS and helpers with ESM default fallback
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AdminJSRaw = require('adminjs');
    const AdminJS = (AdminJSRaw && AdminJSRaw.default) ? AdminJSRaw.default : AdminJSRaw;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AdminJSExpressRaw = require('@adminjs/express');
    const AdminJSExpress = (AdminJSExpressRaw && AdminJSExpressRaw.default) ? AdminJSExpressRaw.default : AdminJSExpressRaw;

    // Try to load the TypeORM adapter robustly
    let adapterLoaded = false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AdminJSTypeormRaw = require('@adminjs/typeorm');
      const AdminJSTypeorm = (AdminJSTypeormRaw && AdminJSTypeormRaw.default) ? AdminJSTypeormRaw.default : AdminJSTypeormRaw;
      AdminJS.registerAdapter(AdminJSTypeorm);
      adapterLoaded = true;
    } catch (e) {
      console.warn('AdminJS TypeORM adapter failed to load in admin.setup:', e && e.message ? e.message : e);
    }

    // Import entities
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Entities = require('../database/entities');

    // Build resources with helpful options (hide sensitive fields, choose list/edit/show fields)
    const resources = [] as any[];
    if (adapterLoaded) {
      for (const [name, entity] of Object.entries(Entities)) {
        const options: any = { navigation: 'Data' };

        // Per-entity customizations
        if (name === 'User') {
          options.properties = {
            password_hash: { isVisible: { list: false, filter: false, show: false, edit: false } },
            sessions: { isVisible: false },
            coupon_usages: { isVisible: false },
            carts: { isVisible: false },
            orders: { isVisible: { list: false, filter: false, show: true, edit: false } },
          };
          options.listProperties = ['id', 'email', 'first_name', 'last_name', 'is_admin', 'status', 'created_at'];
          options.showProperties = ['id', 'email', 'first_name', 'last_name', 'phone', 'birth_date', 'is_admin', 'status', 'created_at'];
          options.editProperties = ['email', 'first_name', 'last_name', 'phone', 'birth_date', 'is_admin', 'status'];
          options.filterProperties = ['email', 'is_admin', 'status', 'created_at'];
        } else if (name === 'Product') {
          options.properties = {
            description: { type: 'richtext' },
            product_items: { isVisible: false },
            images: { isVisible: false },
            attributes: { isVisible: false },
            reviews: { isVisible: false },
          };
          options.listProperties = ['id', 'name', 'brand', 'category', 'active', 'created_at'];
          options.showProperties = ['id', 'name', 'description', 'brand', 'category', 'currency', 'active', 'created_at'];
          options.editProperties = ['name', 'description', 'brand_id', 'category_id', 'currency', 'active'];
          options.filterProperties = ['name', 'brand', 'category', 'active'];
        } else if (name === 'Order') {
          options.properties = {
            order_items: { isVisible: false },
            payments: { isVisible: false },
            status_history: { isVisible: false },
            coupon_usages: { isVisible: false },
          };
          options.listProperties = ['id', 'user', 'total_price', 'currency', 'status', 'created_at'];
          options.showProperties = ['id', 'user', 'order_items', 'payments', 'total_price', 'currency', 'status', 'created_at'];
          options.editProperties = ['status'];
          options.filterProperties = ['status', 'user', 'created_at'];
        } else if (name === 'ProductImage') {
          options.properties = { image_path: { isVisible: { list: true, show: true, edit: true, filter: false } } };
          options.listProperties = ['id', 'product', 'image_path'];
        } else {
          // default: hide large relations from lists
          options.properties = { created_at: { isVisible: { list: true, show: true, edit: false, filter: true } } };
        }

        resources.push({ resource: entity, options });
      }
    }

    const admin = new AdminJS({
      resources,
      rootPath: '/admin',
      branding: { companyName: 'GlobalMart Admin' },
    });

    const router = AdminJSExpress.buildRouter(admin as any);
    // Mount on the Nest/Express app
    (app as any).use(admin.options.rootPath, router);

    console.log('⚙️  Admin panel available at /admin');
    if (!adapterLoaded) console.log('⚠️  Admin panel running without TypeORM resources. Install a compatible @adminjs/typeorm to manage entities.');
  } catch (err) {
    console.warn('Failed to initialize AdminJS in admin.setup:', err && err.message ? err.message : err);
  }
}
