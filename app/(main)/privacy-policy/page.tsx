import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            1. Information We Collect
          </h2>
          <p className="leading-relaxed">
            We collect information you provide directly to us, such as when you
            create an account, book an appointment, or contact us for support.
            This may include your name, email address, phone number, and payment
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            2. How We Use Your Information
          </h2>
          <p className="leading-relaxed">
            We use the information we collect to provide, maintain, and improve
            our services, to process your transactions, to communicate with you,
            and to personalize your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            3. Data Security
          </h2>
          <p className="leading-relaxed">
            We implement reasonable security measures to help protect your
            personal information from loss, theft, misuse, and unauthorized
            access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            4. Your Rights
          </h2>
          <p className="leading-relaxed">
            You have the right to access, correct, or delete your personal
            information. You may also have the right to object to or restrict
            certain processing of your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            5. Contact Us
          </h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at:
            <br />
            Email: support@salonably.com
            <br />
            Phone: +91 7559092281
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
