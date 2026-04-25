/**
 * SEO & GEO 核心配置文件
 * 针对“重磅基础款 (Heavyweight Basics)”赛道精细化优化
 */

export const SEO_CONFIG = {
  // 基础企业信息 (GEO)
  company: {
    name: "东莞市凯乐格服饰有限公司 / Kellogg Fashion",
    shortName: "Kellogg Fashion",
    location: "Dongguan, China",
    address: {
      region: "CN-GD",
      placename: "Dongguan",
      locality: "Humen Town",
      position: "22.8229;113.7236", // 虎门坐标
      country: "CN"
    },
    coordinates: {
      latitude: 22.8229,
      longitude: 113.7236
    }
  },

  // 核心关键词矩阵
  keywords: [
    "heavyweight hoodie manufacturer",
    "heavyweight t-shirt supplier",
    "sweatpants manufacturer",
    "custom streetwear manufacturer",
    "blank apparel wholesale",
    "OEM clothing factory China",
    "Humen clothing export"
  ],

  // 针对不同页面的精细化 SEO 内容映射
  // key 对应页面的 path (去除了前导斜杠)
  pageOverrides: {
    // 首页重构
    '': {
      title: {
        en: "Heavyweight Hoodie & T-Shirt Manufacturer | Custom Streetwear Supplier | Kellogg Fashion",
        zh: "重磅卫衣与T恤制造商 | 街头服饰定制供应商 | Kellogg Fashion"
      },
      description: {
        en: "Kellogg Fashion is a professional heavyweight hoodie, t-shirt, and sweatpants manufacturer in China. We specialize in custom streetwear, blank apparel wholesale, and private label production for global brands.",
        zh: "Kellogg Fashion 是专业的重磅卫衣、T恤、卫裤制造商。专注于街头服饰定制与空白服装批发，为全球品牌提供贴牌生产服务。"
      }
    },
    // GEO 落地页矩阵 (对应具体国家路径)
    'usa-heavyweight-hoodie-manufacturer': {
      title: {
        en: "Heavyweight Hoodie Manufacturer for USA Streetwear Brands",
        zh: "针对美国街头服饰品牌的重磅卫衣制造商"
      },
      description: {
        en: "Kellogg Fashion works with USA streetwear brands to produce high-quality heavyweight hoodies and oversized blank apparel. Flexible MOQ and fast shipping to the United States.",
        zh: "为美国街头品牌生产高品质重磅卫衣与廓形空白服装。支持灵活起订量，美国极速直邮。"
      }
    },
    'uk-streetwear-clothing-manufacturer': {
      title: {
        en: "Streetwear Clothing Manufacturer for UK Fashion Brands",
        zh: "针对英国时尚品牌的街头服饰制造商"
      },
      description: {
        en: "We supply premium heavyweight hoodies and t-shirts to UK fashion brands, retail, and boutiques. Matching the growing demand for premium streetwear in the UK market.",
        zh: "为英国时尚品牌和精品店提供优质重磅卫衣与T恤，精准匹配英国市场对高端街头服饰的需求。"
      }
    },
    'canada-blank-apparel-supplier': {
      title: {
        en: "Blank Apparel Supplier for Canada | Heavy & Warm Hoodies",
        zh: "加拿大空白服装供应商 | 加厚保暖卫衣"
      },
      description: {
        en: "Specializing in cold-weather heavyweight hoodies (400-500 GSM) and custom streetwear for the Canadian market. High durability and warmth.",
        zh: "专为加拿大市场提供抗寒重磅卫衣（400-500 GSM）及街头服饰定制。高耐用性与极致保暖。"
      }
    },
    'australia-heavyweight-tshirt-supplier': {
      title: {
        en: "Heavyweight T-Shirt Supplier for Australia | Casual & Comfort",
        zh: "澳大利亚重磅T恤供应商 | 休闲与舒适"
      },
      description: {
        en: "Premium heavyweight t-shirts and blank apparel wholesale for Australian brands. Focused on casual wear, comfort, and custom OEM manufacturing.",
        zh: "为澳大利亚品牌提供优质重磅T恤及空白服装批发。专注休闲舒适体验及 OEM 贴牌定制。"
      }
    },
    'germany-streetwear-manufacturer': {
      title: {
        en: "Quality Streetwear Manufacturer for Germany | Precision Blank Apparel",
        zh: "德国高品质街头服饰制造商 | 精工空白服装"
      },
      description: {
        en: "Providing German streetwear brands with durable, high-quality heavyweight hoodies and t-shirts. Strict quality control and precision manufacturing.",
        zh: "为德国街头品牌提供耐用、高品质的重磅卫衣与T恤。严格的质量控制与精工制造标准。"
      }
    },
    'europe-blank-clothing-wholesale': {
      title: {
        en: "Wholesale Heavyweight Blank Apparel Supplier for Europe",
        zh: "欧洲重磅空白服装批发供应商"
      },
      description: {
        en: "Kellogg Fashion provides custom streetwear manufacturing services for European brands, including 500 GSM hoodies, oversized t-shirts, and sweatpants.",
        zh: "为欧洲品牌提供定制化街头服饰制造服务，包括 500克重卫衣、廓形T恤和卫裤。"
      }
    }
  }
};
