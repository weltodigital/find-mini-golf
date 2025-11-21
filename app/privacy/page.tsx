import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Find Mini Golf',
  description: 'Privacy Policy for Find Mini Golf - How we collect, use, and protect your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Privacy Policy</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-8">
              Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                Find Mini Golf is a directory website that helps users find mini golf venues across the UK.
                We collect minimal information to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Usage Data:</strong> We may collect information about how you use our website, including pages visited and time spent on our site.</li>
                <li><strong>Contact Information:</strong> If you contact us via email, we collect the information you provide in your message.</li>
                <li><strong>Analytics:</strong> We use standard web analytics to understand how our site is used (anonymized data only).</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Provide and maintain our venue directory service</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Improve our website and user experience</li>
                <li>Understand how our service is used to make improvements</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                This does not include trusted third parties who assist us in operating our website,
                conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience.
                These help us understand how you use our site and improve our services. You can choose to disable
                cookies through your browser settings, though this may affect some functionality.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information. However,
                no method of transmission over the Internet or electronic storage is 100% secure, so we
                cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">Under UK data protection laws, you have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Request transfer of your personal data</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our website contains links to third-party venues and services. We are not responsible
                for the privacy practices or content of these external sites. We encourage you to
                review the privacy policies of any third-party sites you visit.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our service is intended for general audiences and we do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your
                child has provided us with personal information, please contact us.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
              </p>
            </div>

            <div className="bg-primary-50 rounded-lg border border-primary-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:findminigolf@weltodigital.com" className="text-primary-600 hover:text-primary-700">findminigolf@weltodigital.com</a></p>
                <p><strong>Website:</strong> <a href="https://findminigolf.com" className="text-primary-600 hover:text-primary-700">findminigolf.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}