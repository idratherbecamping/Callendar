"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Callendar?",
      answer:
        "Beesly is an advanced AI phone call assistant designed to function as your personal assistant. It mimics human-like conversation to handle phone calls and assist you in managing tasks efficiently.",
    },
    {
      question: "How does Callendar work?",
      answer:
        "Callendar uses cutting-edge AI technology to understand and respond to natural language during phone calls. It's equipped with a diverse range of features to make your communication seamless and productive.",
    },
    {
      question: "Is Callendar compatible with both iOS and Android devices",
      answer:
        "Yes, Callendar is designed to seamlessly operate on both iOS and Android platforms, ensuring a smooth and consistent experience regardless of your device. Whether you're using an iPhone or an Android smartphone, Beesly is made to work effortlessly, providing you with a versatile AI assistant on the go.",
    },
    {
      question: "Is there a community for Callendar?",
      answer:
        "Yes! You can Join our vibrant Discord channel to connect with other users, share experiences, and get timely updates and support.",
    },
  ];

  return (
    <section id="FAQs" className="beesly-section beesly-section-spacer bg-beeslyDark">
      <div className="beesly-container">
        <div className="text-center mb-16">
          <span className="beesly-section-title">
            FAQs
          </span>
          <h2 className="beesly-section-heading">
            We've got the answers
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-5">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-gray-800 rounded-lg bg-secondary/20 overflow-hidden transition-all duration-300 hover:bg-secondary/30 hover:border-gray-700"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/40 text-left accordion-trigger">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-24 bg-secondary/30 rounded-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center hover:bg-secondary/40 transition-all duration-300 hover:shadow-lg">
          <div className="md:w-1/2">
            <span className="text-xs text-beeslyYellow">Join our Discord Channel</span>
            <h3 className="text-2xl font-bold mt-3 mb-4">
              "No more hiring assistants—try our AI assistant for simplified solutions."
            </h3>
            <p className="text-gray-300 mb-8">
              A truly innovative approach to gameplay that sets this agency apart from its peers within the broader industry
            </p>
            <Button className="beesly-button beesly-button-yellow h-12">
              Join Discord Community
            </Button>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://web-assets.same.dev/2675228383/1941095856.png"
              alt="Woman smiling while talking on phone"
              width={400}
              height={300}
              className="rounded-xl object-cover hover-scale transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
