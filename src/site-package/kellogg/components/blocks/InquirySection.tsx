import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Phone, Globe, Building2, Package } from 'lucide-react';
import { useInquiry } from '../../../../core/hooks/useInquiry';
import type { Language } from '../../types';
import TurnstileWidget from '../../../../core/components/TurnstileWidget';

interface Props {
  lang: Language;
}

export default function InquirySection({ lang }: Props) {
  const {
    formData,
    setFormData,
    isSubmitting,
    isSuccess,
    setIsSuccess,
    setTurnstileToken,
    turnstileResetKey,
    handleSubmit,
    config,
    t,
    language
  } = useInquiry(lang);

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {config.title[language]}
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-1 bg-gray-900 mx-auto rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-gray-200/40"
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">{t.form.success}</h2>
                  <p className="text-gray-500">{t.form.successMsg}</p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-gray-900 font-bold border-b-2 border-gray-900 hover:text-black hover:border-black transition-colors"
                >
                  {t.form.back}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      {t.form.name} *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={language === 'zh' ? '请输入您的姓名' : 'Enter your name'}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      {t.form.email} *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {t.form.phone}
                    </label>
                    <input
                      type="tel"
                      placeholder="+1..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {t.form.country}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'zh' ? '输入国家' : 'Your country'}
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {t.form.company}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'zh' ? '输入公司名称' : 'Company name'}
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                      <Package className="w-3 h-3" /> {t.form.productType}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'zh' ? '想要的产品' : 'Interested product'}
                      value={formData.product_type}
                      onChange={e => setFormData({...formData, product_type: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      {t.form.quantity}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500 pcs"
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    {t.form.message} *
                  </label>
                  <textarea
                    required
                    placeholder={language === 'zh' ? '告诉我们您的具体需求' : 'Tell us about your requirements...'}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-gray-900 focus:ring-0 transition-all text-sm min-h-[140px] outline-none"
                  />
                </div>

                <TurnstileWidget lang={lang} onTokenChange={setTurnstileToken} resetKey={turnstileResetKey} />

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-gray-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                  {t.form.submit}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
