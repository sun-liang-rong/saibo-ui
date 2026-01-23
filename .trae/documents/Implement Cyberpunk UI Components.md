I will implement the missing Cyberpunk UI components based on the provided design files (`code.html`) to ensure high fidelity to the design.

**1. Create New Components:**
I will create the following components in `packages/ui/src/components/`:

*   **`Select.tsx`**: A styled dropdown component with custom arrow icon and Cyberpunk borders.
*   **`Textarea.tsx`**: A multiline input component matching the `Input` style.
*   **`Table.tsx`**: A composite component set (`Table`, `TableHeader`, `TableRow`, `TableCell`, etc.) with hover effects and specific header styling.
*   **`Tabs.tsx`**: A navigation tab component with active states and hover effects.
*   **`StatCard.tsx`**: A dashboard statistic card with support for icons, values, trends, and glowing effects.
*   **`Alert.tsx`**: A high-priority alert widget with gradient backgrounds and action buttons.
*   **`Pagination.tsx`**: A step/page indicator component.

**2. Update Existing Components (if needed):**
*   **`Input.tsx`**: Verify and potentially add support for the "Search" variant if not fully covered.
*   **`Button.tsx`**: Ensure all variants (including the icon-only group) are fully supported.

**3. Export Components:**
*   Update `packages/ui/src/components/index.ts` to export all new components.

**4. Verification:**
*   I will verify the implementation by creating a Storybook story or a simple test file if needed, but primarily by ensuring the code structure matches the HTML design files exactly.

**Technical Details:**
*   **Styling**: Use Tailwind CSS with the configured theme (colors: `primary`, `secondary`, `surface-dark`, etc.).
*   **Icons**: Use `MaterialSymbolsOutlined` helper where appropriate.
*   **Utils**: Use `cn` for class merging.
