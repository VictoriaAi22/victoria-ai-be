import type { Schema, Attribute } from '@strapi/strapi';

export interface LandingPageLayoutAtAGlanceSection extends Schema.Component {
  collectionName: 'components_landing_page_layout_at_a_glance_sections';
  info: {
    displayName: 'At a glance section';
  };
  attributes: {
    subheading: Attribute.String;
    sectionHeading: Attribute.String;
    sectionItem: Attribute.Component<
      'structural-components.at-a-glance-section-item',
      true
    >;
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

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'landing-page-layout.at-a-glance-section': LandingPageLayoutAtAGlanceSection;
      'landing-page-layout.hero-section': LandingPageLayoutHeroSection;
      'landing-page-layout.join-section': LandingPageLayoutJoinSection;
      'landing-page-layout.why-us': LandingPageLayoutWhyUs;
      'shared-components.button': SharedComponentsButton;
      'structural-components.at-a-glance-section-item': StructuralComponentsAtAGlanceSectionItem;
      'structural-components.companies-logo': StructuralComponentsCompaniesLogo;
      'structural-components.points': StructuralComponentsPoints;
    }
  }
}
