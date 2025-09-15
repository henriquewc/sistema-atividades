# Design Guidelines: Sistema de Acompanhamento de Atividades

## Design Approach
**Selected Approach**: Design System Approach using **Fluent Design** principles, adapted for minimalist aesthetics while maintaining productivity focus.

**Justification**: Utility-focused application requiring clean, professional interface for team activity management with emphasis on functionality over visual complexity.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Orange (Brand): 25 95% 53%
- Green (Brand): 142 76% 41% 
- Gray (Brand): 220 9% 46%

**Light Mode:**
- Primary: 25 95% 53% (Orange)
- Success: 142 76% 41% (Green)
- Neutral: 220 9% 46% (Gray)
- Background: 0 0% 99%
- Surface: 0 0% 100%

**Dark Mode:**
- Primary: 25 95% 65% (Lighter Orange)
- Success: 142 76% 55% (Lighter Green)
- Neutral: 220 9% 65% (Lighter Gray)
- Background: 222 84% 4%
- Surface: 222 84% 6%

**Status Colors:**
- Em dia: 142 76% 41% (Green)
- Próximo: 25 95% 53% (Orange)
- Atrasado: 0 84% 60%
- Concluída: 220 9% 46% (Gray)

### B. Typography
**Primary Font**: Inter (Google Fonts)
- Headlines: 500 weight, 20px-24px (reduced from original)
- Body text: 400 weight, 14px-16px
- Labels: 400 weight, 12px-14px (reduced weight for minimalism)

### C. Layout System
**Spacing Units**: Tailwind classes p-2, p-4, p-6
- Micro spacing: 2 units (8px)
- Component spacing: 4 units (16px)
- Section spacing: 6 units (24px)
- Generous whitespace for clean aesthetic

### D. Component Library

**Navigation**: Minimal left sidebar with icon-only collapsed state, text labels on hover

**Data Tables**: Clean rows without zebra striping, subtle borders only, minimal visual noise

**Status Indicators**: Simple colored dots (8px circles) without text labels for maximum minimalism

**Forms**: Floating labels, borderless inputs with bottom borders only, grouped logically with ample spacing

**Dashboard Cards**: Flat design with subtle border (no shadows), focus on typography hierarchy

**Modals**: Clean overlay with minimal border, no shadows, focus on content

## Visual Treatment

### Minimalist Principles
- No shadows or elevation effects
- Flat design with subtle borders (1px, gray-200 light / gray-800 dark)
- Rounded corners: rounded-md (medium) maximum
- Generous whitespace between all elements

### Interactive Elements
- Buttons: Minimal design with subtle hover states
- Primary: Solid fill with brand orange
- Secondary: Border only with brand colors
- Ghost: Text only with hover background
- Form inputs: Borderless with bottom border focus states

### Data Visualization
Minimal charts using only brand colors (orange, green, gray) with clean lines and no decorative elements.

## Key Design Principles

1. **Radical Simplicity**: Remove all non-essential visual elements
2. **Whitespace First**: Generous spacing creates breathing room
3. **Functional Color**: Colors serve purpose (status, branding) not decoration
4. **Typography Hierarchy**: Achieved through size and weight, not color variation
5. **Content Focus**: Interface disappears to highlight information
6. **Consistent Minimalism**: Every element follows reductive design approach

## Images
**No hero images or decorative visuals**. Small monochromatic icons (16px-20px) may be used sparingly for navigation and status indication only. Client logos limited to 24px maximum, displayed in grayscale to maintain visual consistency.

The system prioritizes information clarity through strategic use of the three brand colors against clean backgrounds, with functionality driving every design decision.