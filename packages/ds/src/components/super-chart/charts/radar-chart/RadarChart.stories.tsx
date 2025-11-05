import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

const data = [
    {
        A: 120,
        B: 110,
        subject: 'Math',
        fullMark: 150,
    },
    {
        A: 98,
        B: 130,
        subject: 'Chinese',
        fullMark: 150,
    },
    {
        A: 86,
        B: 130,
        subject: 'English',
        fullMark: 150,
    },
    {
        A: 99,
        B: 100,
        subject: 'Geography',
        fullMark: 150,
    },
    {
        A: 85,
        B: 90,
        subject: 'Physics',
        fullMark: 150,
    },
    {
        A: 65,
        B: 85,
        subject: 'History',
        fullMark: 150,
    },
];

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'radar',
        title: 'Radar Chart Title',
        tooltip: {
            withContent: false
        },
        radarChart: {
            value: 'subject',
            data,
            labels: [{
                key: 'mike',
                fill: '#8884d8',
                name: 'Mike',
                stroke: '#8884d8',
                dataKey: 'A',
                fillOpacity: 0.6,
            }]
        },
        subtitle: 'Radar Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/SuperChart/RadarChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const SpecifiedDomainRadarChart: Story = {
    args: {
        title: 'Specified Domain Radar Chart',
        subtitle: undefined,
        children: undefined,
        radarChart: {
            value: 'subject',
            data,
            labels: [
                {
                    key: 'mike',
                    fill: '#8884d8',
                    name: 'Mike',
                    stroke: '#8884d8',
                    dataKey: 'A',
                    fillOpacity: 0.6,
                },
                {
                    key: 'lily',
                    fill: '#82ca9d',
                    name: 'Lily',
                    stroke: '#82ca9d',
                    dataKey: 'B',
                    fillOpacity: 0.6,
                },
            ],
            withLegend: true,
            polarRadiusAxis: {
                angle: 30,
                domain: [0, 150],
            }
        }
    }
}