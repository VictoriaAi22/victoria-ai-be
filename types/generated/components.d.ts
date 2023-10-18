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
    totalDownloads: Attribute.Integer & Attribute.Required;
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

export interface TemplateComponentsCoverLetter extends Schema.Component {
  collectionName: 'components_template_components_cover_letters';
  info: {
    displayName: 'Cover Letter';
  };
  attributes: {
    previewImage: Attribute.Media;
    section: Attribute.Component<'template-components.sections', true>;
  };
}

export interface TemplateComponentsCustomSections extends Schema.Component {
  collectionName: 'components_template_components_custom_sections';
  info: {
    displayName: 'custom sections';
  };
  attributes: {
    points: Attribute.Text;
  };
}

export interface TemplateComponentsResume extends Schema.Component {
  collectionName: 'components_template_components_resumes';
  info: {
    displayName: 'resume';
    description: '';
  };
  attributes: {
    previewImage: Attribute.Media;
    sections: Attribute.Component<'template-components.sections', true>;
    customSection: Attribute.Component<
      'template-components.custom-sections',
      true
    >;
  };
}

export interface TemplateComponentsSections extends Schema.Component {
  collectionName: 'components_template_components_sections';
  info: {
    displayName: 'Sections';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    content: Attribute.Text;
    subtitle: Attribute.String;
  };
}

export interface TemplateComponentsTemplate extends Schema.Component {
  collectionName: 'components_template_components_template';
  info: {
    displayName: 'Template';
  };
  attributes: {
    title: Attribute.String;
    coverLetter: Attribute.Component<'template-components.cover-letter'>;
    resume: Attribute.Component<'template-components.resume', true>;
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
      'template-components.cover-letter': TemplateComponentsCoverLetter;
      'template-components.custom-sections': TemplateComponentsCustomSections;
      'template-components.resume': TemplateComponentsResume;
      'template-components.sections': TemplateComponentsSections;
      'template-components.template': TemplateComponentsTemplate;
    }
  }
}
