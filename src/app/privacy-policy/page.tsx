import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Callendar AI",
  description: "Privacy policy for Callendar AI",
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-black">Privacy Policy for Callendar LLC</h1>
      
      <div className="space-y-6">
        <div className="text-sm text-gray-500 mb-6">
          Effective Date: 03/28/2025
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Introduction</h2>
          <p className="text-gray-700">
            This Privacy Policy describes how Callendar LLC ("we," "us," "our"), operating through Callendar.ai, collects, uses, and protects your information when you use our scheduling service. Callendar.ai is an AI-powered scheduling assistant designed to streamline appointments for small businesses by integrating with Google Calendar.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Information We Collect and How We Use It</h2>
          <p className="text-gray-700">
            When you authorize Callendar.ai to access your Google Calendar via the Google Calendar API, you grant us permission to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>View existing calendar events to determine availability.</li>
            <li>Create new calendar events based on scheduled appointments.</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We use this information solely to provide our scheduling service, specifically to find available time slots and manage appointments efficiently, considering current events and necessary commute time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Data Storage and Security</h2>
          <p className="text-gray-700">
            Information retrieved via the Google Calendar API, including event details, availability, and scheduling data, is stored securely on Supabase. We adhere to industry-standard security protocols to protect your data against unauthorized access, disclosure, alteration, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Data Retention and Deletion</h2>
          <p className="text-gray-700">
            We store your personal information for a period of time that is consistent with our business purposes. We will retain your personal information for the length of time needed to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law. When the data retention period expires for a given type of data, we will delete or destroy it. You may request that your personal data be deleted by contacting us at gannon@callendar.ai.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Limitations on Data Use</h2>
          <p className="text-gray-700">
          We do not use your calendar information for any purposes other than managing appointments and determining availability. We neither sell nor share your calendar data for marketing, advertising, or for the development, improvement, or training of AI/ML models.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Use of Google Workspace Data for AI/ML Purposes</h2>
          <p className="text-gray-700">
            We confirm that any user data obtained through Google Workspace APIs is used exclusively to facilitate scheduling and calendar management. Under no circumstances is this data used to develop, improve, or train generalized or non-personalized AI and/or machine learning models. Additionally, we do not transfer or share this data with any third-party AI tools for any AI/ML model development purposes.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Your Consent</h2>
          <p className="text-gray-700">
            By using Callendar.ai and authorizing access to your Google Calendar, you consent to this Privacy Policy and our collection and use of your information as described herein.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Changes to this Policy</h2>
          <p className="text-gray-700">
            We may occasionally update this Privacy Policy to reflect changes in our practices or applicable regulations. We encourage you to periodically review this Privacy Policy for updates. Continued use of our service after changes indicates your acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
          </p>
          <div className="mt-2 text-gray-700">
            <p>Callendar LLC</p>
            <p>Gannon Gesiriech</p>
            <p>gannon@callendar.ai</p>
          </div>
          <p className="text-gray-700 mt-4">
            Thank you for trusting Callendar.ai with your scheduling needs.
          </p>
        </section>
      </div>
    </div>
  )
} 