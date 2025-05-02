/**
 * Placeholder data for the application
 * Used as fallback when API is not available or for development
 */

export const heroData = {
  title: "Streamline Customer Management with Our CRM",
  subtitle: "Powerful, intuitive, and designed for modern businesses",
  description: "Our CRM helps you organize contacts, track interactions, and boost productivity with smart automation tools.",
  ctaText: "Get Started",
  imageUrl: "/images/hero-image.png"
};

export const partnersData = {
  title: "Trusted by Leading Companies",
  partners: [
    { id: 1, name: "Company A", logo: "/images/partner1.svg" },
    { id: 2, name: "Company B", logo: "/images/partner2.svg" },
    { id: 3, name: "Company C", logo: "/images/partner3.svg" },
    { id: 4, name: "Company D", logo: "/images/partner4.svg" },
    { id: 5, name: "Company E", logo: "/images/partner5.svg" }
  ]
};

export const featuresData = {
  title: "Powerful CRM Features",
  subtitle: "Everything you need to manage customer relationships effectively",
  features: [
    {
      id: 1,
      title: "Contact Management",
      description: "Organize and track all your customer information in one place",
      icon: "UserCircle"
    },
    {
      id: 2,
      title: "Sales Pipeline",
      description: "Visualize your sales process and track deals from start to finish",
      icon: "ChartBar"
    },
    {
      id: 3,
      title: "Task Automation",
      description: "Automate repetitive tasks and focus on what matters most",
      icon: "Bolt"
    },
    {
      id: 4,
      title: "Analytics & Reporting",
      description: "Gain insights with powerful analytics and customizable reports",
      icon: "PresentationChart"
    },
    {
      id: 5,
      title: "Email Integration",
      description: "Seamlessly integrate with your email to track all communications",
      icon: "Mail"
    },
    {
      id: 6,
      title: "Mobile Access",
      description: "Access your CRM anytime, anywhere with our mobile app",
      icon: "DeviceMobile"
    }
  ]
};

export const pricingData = {
  title: "Simple, Transparent Pricing",
  subtitle: "Choose the plan that fits your needs",
  plans: [
    {
      id: "starter",
      name: "Starter",
      price: "$19",
      period: "per user/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 1,000 contacts",
        "Basic reporting",
        "Email integration",
        "Mobile app access",
        "5GB storage"
      ],
      ctaText: "Get Started",
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: "$49",
      period: "per user/month",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited contacts",
        "Advanced reporting",
        "Email & calendar integration",
        "Workflow automation",
        "25GB storage",
        "Priority support"
      ],
      ctaText: "Get Started",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "per user/month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited everything",
        "Custom reporting",
        "Advanced security",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "Unlimited storage"
      ],
      ctaText: "Contact Sales",
      popular: false
    }
  ]
};

export const testimonialsData = {
  title: "What Our Customers Say",
  testimonials: [
    {
      id: 1,
      text: "This CRM has transformed how we manage our customer relationships. The interface is intuitive and the automation features save us hours each week.",
      author: "Sarah Johnson",
      position: "Sales Director",
      company: "TechStart Inc.",
      avatar: "/images/avatar1.jpg"
    },
    {
      id: 2,
      text: "We've tried several CRM solutions, but this one stands out for its ease of use and powerful analytics. Our sales team adopted it immediately.",
      author: "Michael Chen",
      position: "COO",
      company: "GrowthSpace",
      avatar: "/images/avatar2.jpg"
    },
    {
      id: 3,
      text: "The customer support is exceptional. Whenever we've had questions, the team has been responsive and helpful. Highly recommended!",
      author: "Emma Rodriguez",
      position: "Customer Success Manager",
      company: "Elevate Retail",
      avatar: "/images/avatar3.jpg"
    }
  ]
};

export default {
  heroData,
  partnersData,
  featuresData,
  pricingData,
  testimonialsData
}; 