import React from 'react';

type ChildrenElementProps = {
    'data-children': string;
    [key: string]: unknown;
};

export default function useChildrenElements(children: React.ReactNode) {
    const childrenElements = React.useMemo(() => {
        const elements: { [key: string]: React.JSX.Element } = {};
        React.Children.forEach(children, (element) => {
            if (React.isValidElement<{ 'data-children': string }>(element)) {
                const key = element.props['data-children'];
                if (key) {
                    elements[key] = element;
                }
            }
        });
        return elements;
    }, [children]);

    const getChildrenElement = (elementId: string): React.ReactNode | null => {
        const element = Object.values(childrenElements).find(
            (child): child is React.ReactElement<ChildrenElementProps> =>
                React.isValidElement<ChildrenElementProps>(child) &&
                child.props['data-children'] === elementId,
        );
        return element || null;
    };

    return { childrenElements, getChildrenElement };
}
