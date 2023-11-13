import type { Schema, Attribute } from '@strapi/strapi';

export interface FooterComponentsFooterLink extends Schema.Component {
  collectionName: 'components_footer_components_footer_links';
  info: {
    displayName: 'Footer Link';
  };
  attributes: {
    title: Attribute.String;
    href: Attribute.String;
  };
}

export interface FooterComponentsSections extends Schema.Component {
  collectionName: 'components_footer_components_sections';
  info: {
    displayName: 'Sections';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    links: Attribute.Component<'footer-components.footer-link', true>;
  };
}

export interface LandingPageLayoutAtAGlanceSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_at_a_glance_sections';
  info: {
    displayName: 'At a glance section';
    description: '';
  };
  attributes: {
    subheading: Attribute.String;
    heading: Attribute.String;
    sectionItem: Attribute.Component<
      'structural-components.at-a-glance-section-item',
      true
    >;
    paragraph: Attribute.Text;
  };
}

export interface LandingPageLayoutCustomerStories extends Schema.Component {
  collectionName: 'components_landing_page_layout_customer_stories';
  info: {
    displayName: 'Customer Stories';
    description: '';
  };
  attributes: {
    subheading: Attribute.String;
    heading: Attribute.String;
    accomplishments: Attribute.Component<
      'structural-components.accomplishment',
      true
    >;
    sectionImage: Attribute.Media;
  };
}

export interface LandingPageLayoutFaqSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_faq_sections';
  info: {
    displayName: 'Faq Section';
  };
  attributes: {
    heading: Attribute.String;
    subheading: Attribute.String;
    paragraph: Attribute.Text;
    faq: Attribute.Component<'structural-components.faqs', true>;
  };
}

export interface LandingPageLayoutFooterSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_footer_sections';
  info: {
    displayName: 'Footer Section';
    description: '';
  };
  attributes: {
    paragraph: Attribute.Text;
    section: Attribute.Component<'footer-components.sections', true>;
  };
}

export interface LandingPageLayoutHeroSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'check';
    description: '';
  };
  attributes: {
    HeroTitle: Attribute.String & Attribute.Required;
    HeroParagraph: Attribute.Text & Attribute.Required;
    HeroSmallImage: Attribute.Media;
    ActionButton: Attribute.Component<'shared-components.button', true>;
    HeroImage: Attribute.Media;
  };
}

export interface LandingPageLayoutJoinSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_join_sections';
  info: {
    displayName: 'Join Section';
    icon: 'check';
    description: '';
  };
  attributes: {
    firstHeading: Attribute.String & Attribute.Required;
    companyLogos: Attribute.Component<
      'structural-components.companies-logo',
      true
    >;
    sectionImage: Attribute.Media;
    MainHeading: Attribute.String;
    secondHeading: Attribute.String;
    paragraph: Attribute.Text;
  };
}

export interface LandingPageLayoutNewsletterSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_newsletter_sections';
  info: {
    displayName: 'Newsletter Section';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    paragraph: Attribute.Text;
    privacyParagraph: Attribute.String;
    sectionImage: Attribute.Media;
  };
}

export interface LandingPageLayoutTestimonialSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_testimonial_sections';
  info: {
    displayName: 'Testimonial Section';
  };
  attributes: {
    heading: Attribute.String;
    paragraph: Attribute.Text;
    sectionImage: Attribute.Media;
    testimonials: Attribute.Component<
      'structural-components.testimonial',
      true
    >;
  };
}

export interface LandingPageLayoutWhyUs extends Schema.Component {
  collectionName: 'components_landing_page_layout_why_uses';
  info: {
    displayName: 'Why Us';
  };
  attributes: {
    heading: Attribute.String;
    subheading: Attribute.String;
    paragraph: Attribute.Text;
    sectionImage: Attribute.Media;
    listPoints: Attribute.Component<'structural-components.points', true>;
  };
}

export interface PlanPlanBenefit extends Schema.Component {
  collectionName: 'components_plan_plan_benefits';
  info: {
    displayName: 'Plan benefit';
    description: '';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface SharedComponentsButton extends Schema.Component {
  collectionName: 'components_landing_page_layout_buttons';
  info: {
    displayName: 'Button';
    description: '';
  };
  attributes: {
    Title: Attribute.String & Attribute.Required;
    Link: Attribute.String & Attribute.Required;
    Variant: Attribute.Enumeration<['Filled', 'Outline']>;
    Icon: Attribute.Media;
    buttonColor: Attribute.String &
      Attribute.CustomField<'plugin::color-picker.color'>;
  };
}

export interface StructuralComponentsAccomplishment extends Schema.Component {
  collectionName: 'components_structural_components_accomplishments';
  info: {
    displayName: 'accomplishment';
  };
  attributes: {
    number: Attribute.String;
    text: Attribute.String;
  };
}

export interface StructuralComponentsAtAGlanceSectionItem
  extends Schema.Component {
  collectionName: 'components_structural_components_at_a_glance_section_items';
  info: {
    displayName: 'At a glance section item';
  };
  attributes: {
    title: Attribute.String;
    paragraph: Attribute.Text;
    Image: Attribute.Media;
  };
}

export interface StructuralComponentsCompaniesLogo extends Schema.Component {
  collectionName: 'components_landing_page_layout_companies_logos';
  info: {
    displayName: 'Companies logo';
    description: '';
  };
  attributes: {
    logo: Attribute.Media;
  };
}

export interface StructuralComponentsFaqs extends Schema.Component {
  collectionName: 'components_structural_components_faqs';
  info: {
    displayName: 'faqs';
  };
  attributes: {
    question: Attribute.String;
    answer: Attribute.Text;
  };
}

export interface StructuralComponentsPoints extends Schema.Component {
  collectionName: 'components_landing_page_layout_points';
  info: {
    displayName: 'points';
    description: '';
  };
  attributes: {
    heading: Attribute.String;
    paragraph: Attribute.Text;
    readMoreLink: Attribute.String;
  };
}

export interface StructuralComponentsTestimonial extends Schema.Component {
  collectionName: 'components_structural_components_testimonials';
  info: {
    displayName: 'testimonial';
  };
  attributes: {
    content: Attribute.Text;
    username: Attribute.String;
    userDesignation: Attribute.String;
    rating: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 1;
        max: 5;
      }>;
  };
}

export interface TemplateComponentsCoverLetterSections
  extends Schema.Component {
  collectionName: 'components_template_components_cover_letter_sections';
  info: {
    displayName: 'Cover Letter Sections';
  };
  attributes: {
    heading: Attribute.Component<'template-components.resume-heading'>;
    address: Attribute.JSON &
      Attribute.DefaultTo<
        [
          {
            to: 'Hiring Person';
            jobTitle: 'Job Title';
            companyName: 'Company Name';
            companyAddress: 'Company Address / Location Here';
          }
        ]
      >;
    greetings: Attribute.String &
      Attribute.DefaultTo<'Dear (Hiring Manager Name)'>;
    opener: Attribute.Text &
      Attribute.DefaultTo<'I am writing to express my deep interest in the Account Executive position at Klaviyo. With my background as a Senior Specialist at Biosense Webster \u2013 Johnson & Johnson and my extensive experience in medical technical sales, I am confident that my skills, passion for tech sales, and ability to learn quickly make me an excellent fit for this role.'>;
    body_1: Attribute.Text &
      Attribute.DefaultTo<'While my educational background in biomedical engineering may not immediately seem relevant to a sales position in the technology industry, I strongly believe that my five-plus years in medical technical sales have provided me with the necessary foundation to excel in this role. I am a fast learner who thrives in commission-based environments, as I have experienced firsthand the intrinsic link between commission-based structures and job satisfaction.'>;
    body_2: Attribute.Text &
      Attribute.DefaultTo<'Throughout my career, I consistently exceeded sales plans, surpassing targets for five consecutive years. In the highly competitive US and Australian markets, I achieved sales plans by 110% or more for three consecutive years. I actively participated in the entire sales cycle, engaging with a diverse range of customers, including physicians, hospital administrators, and C-suite level employees. This broad exposure has sharpened my ability to understand customer needs, build strong relationships, and navigate complex sales environments.'>;
    body_3: Attribute.Text &
      Attribute.DefaultTo<"In addition to my sales achievements, I have a proven track record of performing under high-pressure circumstances, often dealing with life-or-death scenarios in the medical technology field. This experience has instilled in me a sense of resilience, adaptability, and unwavering focus. I am confident that I can bring the same energy and determination to Klaviyo's fast-paced and competitive work environment, contributing to the continued growth and success of the company.">;
    conclusion: Attribute.Text &
      Attribute.DefaultTo<'My unique combination of an engineering background, sales motivation, and ability to learn quickly positions me as an exceptional fit for technical sales. I possess the analytical mindset and problem-solving skills to comprehend complex technology solutions and effectively communicate their value to clients. Furthermore, my commitment to continuous learning ensures that I stay ahead in a rapidly evolving industry. I am genuinely passionate about tech sales and motivated to make a significant impact at Klaviyo. I am confident that my drive, skills, and experience make me an invaluable asset to your sales team.'>;
    call_to_action: Attribute.Text &
      Attribute.DefaultTo<"Thank you for considering my application. I have attached my resume for your review. I welcome the opportunity to discuss how my qualifications align with Klaviyo's vision and how I can contribute to the company's continued success.">;
    signature: Attribute.Text & Attribute.DefaultTo<'Signature'>;
  };
}

export interface TemplateComponentsCoverLetter extends Schema.Component {
  collectionName: 'components_template_components_cover_letters';
  info: {
    displayName: 'Cover Letter';
  };
  attributes: {
    previewImage: Attribute.Media & Attribute.Required;
    sections: Attribute.Component<'template-components.cover-letter-sections'>;
  };
}

export interface TemplateComponentsResumeContact extends Schema.Component {
  collectionName: 'components_template_components_resume_contact';
  info: {
    displayName: 'resume contact';
  };
  attributes: {
    phone: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'23787648'>;
    email: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'user@email.com'>;
    socialLinks: Attribute.JSON &
      Attribute.DefaultTo<
        [
          {
            linkedIn: 'https://linkedIn.com';
            github: 'https://github.com';
            facebook: 'https://facebook.com';
          }
        ]
      >;
  };
}

export interface TemplateComponentsResumeHeading extends Schema.Component {
  collectionName: 'components_template_components_resume_heading';
  info: {
    displayName: 'resume heading';
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'[First name] [Last Name]'>;
    professionalTitle: Attribute.String &
      Attribute.DefaultTo<'Professional Title'>;
    contact: Attribute.Component<'template-components.resume-contact'>;
  };
}

export interface TemplateComponentsResumeSections extends Schema.Component {
  collectionName: 'components_template_components_resume_sections';
  info: {
    displayName: 'resume sections';
  };
  attributes: {
    heading: Attribute.Component<'template-components.resume-heading'>;
    professionalSummary: Attribute.Text & Attribute.Required;
    skills: Attribute.JSON & Attribute.DefaultTo<['React', 'NodeJs']>;
    education: Attribute.JSON &
      Attribute.DefaultTo<
        [
          {
            school: 'Udacity';
            startYear: '2017';
            endYear: '2020';
            courseOfStudy: 'Full Stack Development';
            achievements: ['list achievements to be in bullet points'];
          }
        ]
      >;
    workExperience: Attribute.JSON &
      Attribute.DefaultTo<
        [
          {
            company: 'Company Name';
            location: 'Company Location';
            jobType: 'Full Time, Contract or remote';
            startYear: 'Start Year(ex.2017)';
            endYear: 'End Year(ex. 2018)';
            achievements: ['list achievements to be in bullet points'];
          }
        ]
      >;
    reference: Attribute.JSON &
      Attribute.DefaultTo<
        [
          {
            name: 'Referee Name ';
            contact: 'Referee Contact';
          }
        ]
      >;
    otherSections: Attribute.JSON & Attribute.DefaultTo<[]>;
  };
}

export interface TemplateComponentsResume extends Schema.Component {
  collectionName: 'components_template_components_resumes';
  info: {
    displayName: 'resume';
    description: '';
  };
  attributes: {
    previewImage: Attribute.Media & Attribute.Required;
    sections: Attribute.Component<'template-components.resume-sections'>;
  };
}

export interface TemplateComponentsTemplate extends Schema.Component {
  collectionName: 'components_template_components_template';
  info: {
    displayName: 'Template';
  };
  attributes: {
    coverLetter: Attribute.Component<'template-components.cover-letter'>;
    resume: Attribute.Component<'template-components.resume'>;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'footer-components.footer-link': FooterComponentsFooterLink;
      'footer-components.sections': FooterComponentsSections;
      'landing-page-layout.at-a-glance-section': LandingPageLayoutAtAGlanceSection;
      'landing-page-layout.customer-stories': LandingPageLayoutCustomerStories;
      'landing-page-layout.faq-section': LandingPageLayoutFaqSection;
      'landing-page-layout.footer-section': LandingPageLayoutFooterSection;
      'landing-page-layout.hero-section': LandingPageLayoutHeroSection;
      'landing-page-layout.join-section': LandingPageLayoutJoinSection;
      'landing-page-layout.newsletter-section': LandingPageLayoutNewsletterSection;
      'landing-page-layout.testimonial-section': LandingPageLayoutTestimonialSection;
      'landing-page-layout.why-us': LandingPageLayoutWhyUs;
      'plan.plan-benefit': PlanPlanBenefit;
      'shared-components.button': SharedComponentsButton;
      'structural-components.accomplishment': StructuralComponentsAccomplishment;
      'structural-components.at-a-glance-section-item': StructuralComponentsAtAGlanceSectionItem;
      'structural-components.companies-logo': StructuralComponentsCompaniesLogo;
      'structural-components.faqs': StructuralComponentsFaqs;
      'structural-components.points': StructuralComponentsPoints;
      'structural-components.testimonial': StructuralComponentsTestimonial;
      'template-components.cover-letter-sections': TemplateComponentsCoverLetterSections;
      'template-components.cover-letter': TemplateComponentsCoverLetter;
      'template-components.resume-contact': TemplateComponentsResumeContact;
      'template-components.resume-heading': TemplateComponentsResumeHeading;
      'template-components.resume-sections': TemplateComponentsResumeSections;
      'template-components.resume': TemplateComponentsResume;
      'template-components.template': TemplateComponentsTemplate;
    }
  }
}
