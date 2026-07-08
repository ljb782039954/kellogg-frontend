import { Link, useParams } from 'react-router'
import { useState } from 'react'
import { ChevronRight, Minus, Plus, Heart, Star, Truck, RotateCcw, Shield } from 'lucide-react'
import { getProductById, getProductsByStyle } from '../data/shared'

export default function LuxeProductDetail() {
  const { id } = useParams()
  const product = getProductById(Number(id))
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('material')

  if (!product || product.style !== 'luxury') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <h2 className="font-luxury-heading text-2xl mb-4" style={{ color: 'var(--color-ink)' }}>Product not found</h2>
          <Link to="/luxury/products" className="text-sm underline-hover" style={{ color: 'var(--color-brand)' }}>Back to collections</Link>
        </div>
      </div>
    )
  }

  const related = getProductsByStyle('luxury').filter(p => p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
      {/* Breadcrumb */}
      <nav className="bg-surface sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs" style={{ color: 'var(--color-subtle)' }}>
          <Link to="/luxury" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/luxury/products" className="hover:text-ink transition-colors">Collections</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-ink)' }}>{product.name}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <div className="rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <button key={i} className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${i === 0 ? 'border-brand' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="font-luxury-heading text-3xl sm:text-4xl mb-2" style={{ color: 'var(--color-ink)' }}>{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-semibold" style={{ color: 'var(--color-brand)' }}>${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg line-through" style={{ color: 'var(--color-subtle)' }}>${product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= Math.floor(product.rating || 0) ? 'var(--color-brand)' : 'none'} style={{ color: 'var(--color-brand)' }} />
                ))}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>{product.rating} ({product.reviews} reviews)</span>
            </div>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--color-body)' }}>{product.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <span className="text-xs tracking-wider uppercase block mb-3" style={{ color: 'var(--color-subtle)' }}>Color: {product.colors?.[selectedColor]}</span>
              <div className="flex gap-3">
                {product.colors?.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(i)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${i === selectedColor ? 'border-brand scale-110' : 'border-transparent'}`}
                    style={{ background: color.toLowerCase().includes('champagne') || color.toLowerCase().includes('cream') || color.toLowerCase().includes('ivory') || color.toLowerCase().includes('oatmeal') || color.toLowerCase().includes('sand') || color.toLowerCase().includes('beige') || color.toLowerCase().includes('blush') || color.toLowerCase().includes('grey') || color.toLowerCase().includes('dusty') ? 'var(--color-border)' : color.toLowerCase().includes('camel') ? '#C19A6B' : color.toLowerCase().includes('charcoal') ? '#36454F' : color.toLowerCase().includes('navy') ? '#1B3A5C' : color.toLowerCase().includes('sage') ? '#9CAF88' : '#D4AF37' }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <span className="text-xs tracking-wider uppercase block mb-3" style={{ color: 'var(--color-subtle)' }}>Size</span>
              <div className="flex gap-2">
                {product.sizes?.map((size, i) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(i)}
                    className={`w-12 h-10 rounded-lg text-xs font-medium transition-all ${i === selectedSize ? 'bg-ink text-on-dark' : 'border'}`}
                    style={i !== selectedSize ? { borderColor: 'var(--color-border)', color: 'var(--color-ink)' } : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3"><Minus size={14} style={{ color: 'var(--color-subtle)' }} /></button>
                <span className="px-3 text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3"><Plus size={14} style={{ color: 'var(--color-subtle)' }} /></button>
              </div>
              <button className="flex-1 py-3 rounded-full text-sm tracking-wider uppercase font-medium transition-all hover:opacity-90" style={{ background: 'var(--color-brand)', color: 'var(--color-on-dark)' }}>
                Add to Cart
              </button>
              <button className="w-12 h-12 border rounded-lg flex items-center justify-center transition-all hover:bg-soft" style={{ borderColor: 'var(--color-border)' }}>
                <Heart size={18} style={{ color: 'var(--color-subtle)' }} />
              </button>
            </div>

            {/* Accordion */}
            <div className="border-t" style={{ borderColor: 'var(--color-border)' }}>
              {[
                { id: 'material', title: 'Material & Care', content: product.material },
                { id: 'sizing', title: 'Sizing Guide', content: 'Our pieces are designed to fit true to size. For a more relaxed fit, we recommend sizing up. Model wears size S.' },
                { id: 'shipping', title: 'Shipping & Returns', content: 'Complimentary shipping on all orders over $200. Returns accepted within 14 days of delivery.' },
              ].map(tab => (
                <div key={tab.id} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <button onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{tab.title}</span>
                    <span className="text-lg transition-transform" style={{ color: 'var(--color-subtle)', transform: activeTab === tab.id ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {activeTab === tab.id && (
                    <p className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--color-body)' }}>{tab.content}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: RotateCcw, label: '14-Day Returns' },
                { icon: Shield, label: 'Secure Payment' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} style={{ color: 'var(--color-subtle)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <h2 className="font-luxury-heading text-2xl mb-8" style={{ color: 'var(--color-ink)' }}>You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/luxury/product/${p.id}`} className="group">
                <div className="rounded-lg overflow-hidden img-zoom mb-3" style={{ aspectRatio: '3/4' }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-luxury-heading text-sm mb-1 group-hover:underline decoration-brand underline-offset-4" style={{ color: 'var(--color-ink)' }}>{p.name}</h4>
                <p className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>${p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: 'var(--color-ink)' }} className="py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-luxury-heading text-xl text-on-dark mb-2">LILIAN</p>
          <p className="text-xs" style={{ color: 'var(--color-subtle)' }}>漏 2026 Elegance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}



