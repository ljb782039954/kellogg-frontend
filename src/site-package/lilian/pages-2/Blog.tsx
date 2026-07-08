import { Link } from 'react-router'
import { getBlogPostsByStyle } from '../data/shared'
import { Clock } from 'lucide-react'

export default function LuxeBlog() {
  const posts = getBlogPostsByStyle('luxury')
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
      <nav className="bg-surface backdrop-blur-md sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/luxury" className="font-luxury-heading text-2xl tracking-wider" style={{ color: 'var(--color-ink)' }}>LILIAN</Link>
          <Link to="/luxury" className="text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--color-subtle)' }}>Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-luxury-heading text-4xl mb-4" style={{ color: 'var(--color-ink)' }}>Journal</h1>
        <p className="mb-12" style={{ color: 'var(--color-subtle)' }}>Stories, insights, and inspiration from the world of timeless fashion.</p>

        {/* Featured Post */}
        {featured && (
          <Link to={`/luxury/blog/${featured.id}`} className="group block mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden h-80 lg:h-96 img-zoom">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs tracking-wider uppercase px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--color-soft)', color: 'var(--color-brand)' }}>{featured.category}</span>
                <h2 className="font-luxury-heading text-3xl sm:text-4xl mb-4 group-hover:underline decoration-brand underline-offset-4 transition-all" style={{ color: 'var(--color-ink)' }}>{featured.title}</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--color-body)' }}>{featured.excerpt}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>{featured.author}</span>
                  <span style={{ color: 'var(--color-border)' }}>|</span>
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-subtle)' }}><Clock size={12} /> {featured.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {rest.map(post => (
            <Link key={post.id} to={`/luxury/blog/${post.id}`} className="group">
              <div className="rounded-lg overflow-hidden h-56 img-zoom mb-4">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--color-brand)' }}>{post.category}</span>
              <h3 className="font-luxury-heading text-xl mt-2 mb-2 group-hover:text-brand transition-colors" style={{ color: 'var(--color-ink)' }}>{post.title}</h3>
              <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-subtle)' }}>{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-subtle)' }}>
                <span>{post.date}</span>
                <span><Clock size={10} className="inline mr-1" />{post.readTime}</span>
              </div>
            </Link>
          ))}
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



