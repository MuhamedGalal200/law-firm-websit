'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FaTwitter, FaFacebookF, FaGooglePlusG } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email(t('invalid_email')).required(t('required')),
    }),
    onSubmit: async (
      values: { email: string },
      { resetForm }: { resetForm: () => void }
    ) => {

      setError('')
      setSubmitted(false)
      setLoading(true)

      try {
        const res = await fetch('http://localhost:1337/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { email: values.email } }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData?.error?.message || t('something_wrong'))
        }

        setSubmitted(true)
        resetForm()
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <footer className="bg-[#4f2e1e] text-white px-6 md:px-16 py-10 text-sm">
      {/* Top Section: Right-aligned row with email + icons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-end">
          {/* Email Form inline with icons */}
          <form
            onSubmit={formik.handleSubmit}
            className="flex items-center bg-white rounded px-1 py-1 gap-1"
          >
            <input
              type="email"
              name="email"
              placeholder={t('email')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="px-3 py-[6px] text-sm rounded text-black outline-none w-36"
            />
            <button
              type="submit"
              className="bg-[#4f2e1e] text-white text-xs px-3 py-[6px] rounded disabled:opacity-50"
              disabled={loading}
            >
              {t('subscribe')}
            </button>
          </form>

          {/* Messages */}
          <div className="text-xs mt-1 text-center min-h-[1.2rem]">
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-300">{formik.errors.email}</p>
            )}
            {submitted && <p className="text-green-300">{t('subscribed_success')}</p>}
            {error && <p className="text-red-300">{error}</p>}
          </div>

          {/* Contacts + Social Icons */}
          <div className="flex items-center gap-4">
            <span className="text-white">{t('contacts')}</span>
            <FaTwitter className="cursor-pointer hover:text-gray-300" />
            <FaFacebookF className="cursor-pointer hover:text-gray-300" />
            <FaGooglePlusG className="cursor-pointer hover:text-gray-300" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-400 mb-6 w-full" />

      {/* Bottom Links */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-6">
          <span className="hover:underline cursor-pointer">{t('about')}</span>
          <span className="hover:underline cursor-pointer">{t('strategy')}</span>
          <span className="hover:underline cursor-pointer">{t('advantages')}</span>
          <span className="hover:underline cursor-pointer">{t('responsibility')}</span>
          <span className="hover:underline cursor-pointer">{t('services')}</span>
        </div>
        <div className="text-sm text-gray-300">
          © 2024 . {t('all_rights_reserved')}
        </div>
      </div>
    </footer>
  )
}

