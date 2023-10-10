import type { Schema, Attribute } from '@strapi/strapi';

export interface LandingPageLayoutButton extends Schema.Component {
  collectionName: 'components_landing_page_layout_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    Title: Attribute.String & Attribute.Required;
    Link: Attribute.String & Attribute.Required;
    Variant: Attribute.Enumeration<['Fillled', 'Outline']>;
    Icon: Attribute.Media;
  };
}

export interface LandingPageLayoutCompaniesLogo extends Schema.Component {
  collectionName: 'components_landing_page_layout_companies_logos';
  info: {
    displayName: 'Companies logo';
  };
  attributes: {
    logo: Attribute.Media;
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
    ActionButton: Attribute.Component<'landing-page-layout.button', true>;
    HeroImage: Attribute.Media;
  };
}

export interface LandingPageLayoutJoinSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_join_sections';
  info: {
    displayName: 'Join Section';
    icon: 'check';
  };
  attributes: {
    heading2: Attribute.String & Attribute.Required;
    companyLogos: Attribute.Component<
      'landing-page-layout.companies-logo',
      true
    >;
    heading3: Attribute.String;
    heading1: Attribute.String;
    paragraph: Attribute.Text;
    sectionImage: Attribute.Media;
  };
}

export interface LandingPageLayoutPoints extends Schema.Component {
  collectionName: 'components_landing_page_layout_points';
  info: {
    displayName: 'points';
  };
  attributes: {
    heading: Attribute.String;
    paragraph: Attribute.Text;
  };
}

export interface LandingPageLayoutWhyInstalletter extends Schema.Component {
  collectionName: 'components_landing_page_layout_why_installetters';
  info: {
    displayName: 'Why Installetter';
    icon: 'check';
  };
  attributes: {
    heading3: Attribute.String & Attribute.Required;
    heading2: Attribute.String;
    paragraph: Attribute.Text;
    sectionImage: Attribute.Media;
    point: Attribute.Component<'landing-page-layout.points', true>;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'landing-page-layout.button': LandingPageLayoutButton;
      'landing-page-layout.companies-logo': LandingPageLayoutCompaniesLogo;
      'landing-page-layout.hero-section': LandingPageLayoutHeroSection;
      'landing-page-layout.join-section': LandingPageLayoutJoinSection;
      'landing-page-layout.points': LandingPageLayoutPoints;
      'landing-page-layout.why-installetter': LandingPageLayoutWhyInstalletter;
    }
  }
}
