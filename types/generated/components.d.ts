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

export interface LandingPageLayoutHeroSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'check';
    description: '';
  };
  attributes: {
    HeroTitle: Attribute.String & Attribute.Required;
    HeroParagraph: Attribute.String & Attribute.Required;
    HeroSmallImage: Attribute.Media;
    ActionButton: Attribute.Component<'landing-page-layout.button', true>;
    HeroImage: Attribute.Media;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'landing-page-layout.button': LandingPageLayoutButton;
      'landing-page-layout.hero-section': LandingPageLayoutHeroSection;
    }
  }
}
