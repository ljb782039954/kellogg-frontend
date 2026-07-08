import { Link, useParams } from 'react-router'
import { ChevronRight, Clock, Share2, Bookmark } from 'lucide-react'
import { getBlogPostById, getBlogPostsByStyle } from '../data/shared'

export default function LuxeBlogDetail() {
  const { id } = useParams()
  const post = getBlogPostById(Number(id))

  if (!post || post.style !== 'luxury') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <h2 className="font-luxury-heading text-2xl mb-4" style={{ color: 'var(--color-ink)' }}>Article not found</h2>
          <Link to="/luxury/blog" className="text-sm underline-hover" style={{ color: 'var(--color-brand)' }}>Back to Journal</Link>
        </div>
      </div>
    )
  }

  const related = getBlogPostsByStyle('luxury').filter(p => p.id !== post.id)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', fontFamily: "'Inter', 'PingFang SC', sans-serif" }}>
      <nav className="bg-surface backdrop-blur-md sticky top-0 z-50 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs" style={{ color: 'var(--color-subtle)' }}>
          <Link to="/luxury" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/luxury/blog" className="hover:text-ink transition-colors">Journal</Link>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-ink)' }} className="truncate max-w-[200px]">{post.title}</span>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <span className="text-xs tracking-wider uppercase px-3 py-1 rounded-full" style={{ background: 'var(--color-soft)', color: 'var(--color-brand)' }}>{post.category}</span>
        <h1 className="font-luxury-heading text-3xl sm:text-4xl mt-6 mb-4" style={{ color: 'var(--color-ink)' }}>{post.title}</h1>
        <div className="flex items-center gap-4 mb-10 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-on-dark text-xs font-semibold" style={{ background: 'var(--color-brand)' }}>
            {post.author.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <span className="text-sm font-medium block" style={{ color: 'var(--color-ink)' }}>{post.author}</span>
            <span className="text-xs" style={{ color: 'var(--color-subtle)' }}>{post.date} 路 {post.readTime} read</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none" style={{ color: 'var(--color-body)', lineHeight: '1.8' }}>
          {post.content.split('\n\n').map((paragraph, i) => (
            paragraph.startsWith('"') ? (
              <blockquote key={i} className="border-l-4 pl-6 my-8 italic font-luxury-heading text-xl" style={{ borderColor: 'var(--color-brand)', color: 'var(--color-ink)' }}>
                {paragraph}
              </blockquote>
            ) : (
              <p key={i} className="mb-6">{paragraph}</p>
            )
          ))}
        </div>

        {/* Share & Tags */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex gap-2">
            {['Fashion', 'Style', 'Luxury'].map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-subtle)' }}>{tag}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-soft" style={{ borderColor: 'var(--color-border)' }}>
              <Share2 size={14} style={{ color: 'var(--color-subtle)' }} />
            </button>
            <button className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors hover:bg-soft" style={{ borderColor: 'var(--color-border)' }}>
              <Bookmark size={14} style={{ color: 'var(--color-subtle)' }} />
            </button>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-luxury-heading text-2xl mb-8" style={{ color: 'var(--color-ink)' }}>More Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map(p => (
              <Link key={p.id} to={`/luxury/blog/${p.id}`} className="group">
                <div className="rounded-lg overflow-hidden h-40 img-zoom mb-3">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-luxury-heading text-sm group-hover:text-brand transition-colors" style={{ color: 'var(--color-ink)' }}>{p.title}</h4>
                <span className="text-xs flex items-center gap-1 mt-1" style={{ color: 'var(--color-subtle)' }}><Clock size={10} />{p.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer style={{ background: 'var(--color-ink)' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-luxury-heading text-xl text-on-dark mb-2">LILIAN</p>
          <p className="text-xs" style={{ color: 'var(--color-subtle)' }}>漏 2026 Elegance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}



