import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Wallet } from "lucide-react";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header / Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="p-1.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Wallet size={18} className="text-white" />
            </div>
            <span>
              Life<span className="text-blue-400">Ledger</span>
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <ShieldCheck size={32} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Terms and Conditions</h1>
              <p className="text-slate-400 mt-1">Last updated: April 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed text-slate-400">
            
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using LifeLedger ("we", "our", or "us"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                2. Disclaimer of Financial Advice
              </h2>
              <p className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-blue-200">
                <strong>Important:</strong> LifeLedger is a personal tracking tool designed to help you monitor funds, habits, and stocks. <strong>We are not financial advisors.</strong> The information provided by our platform does not constitute financial, investment, or legal advice. Always conduct your own research or consult with a certified professional before making financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                3. User Accounts and Security
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are solely responsible for maintaining the confidentiality of your account credentials (email and password).</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate our terms or engage in fraudulent activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Data Privacy and Storage
              </h2>
              <p>
                Your data, including financial entries and habit logs, is stored securely using Firebase. While we implement industry-standard security measures, no system is entirely foolproof. By using LifeLedger, you acknowledge and accept the inherent risks of storing data online. We do not sell your personal financial data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                5. Intellectual Property
              </h2>
              <p>
                The LifeLedger name, logos, website design, and underlying code are the exclusive property of LifeLedger. You may not copy, modify, distribute, or reproduce any part of our service without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                6. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, LifeLedger shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                7. Modifications to the Service and Terms
              </h2>
              <p>
                We reserve the right to modify or discontinue our service at any time without prior notice. We may also revise these Terms and Conditions from time to time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="border-t border-slate-800 pt-8 mt-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact support at{" "}
                <a href="mailto:support@lifeledger.app" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">
                  support@lifeledger.app
                </a>.
              </p>
            </section>

          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm mt-8">
          © {new Date().getFullYear()} LifeLedger. All rights reserved.
        </div>
      </div>
    </div>
  );
}