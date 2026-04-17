import React from 'react';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { AlertProvider, useAlert } from './AlertContext';
import Alert, { type AlertDataProps } from './Alert';
import AlertComponent from './AlertComponent';
import useAlertState from './useAlertState';

jest.mock('../../animations', () => ({
    Slide: ({ children }: any) => <>{children}</>
}));

function TestConsumer(alertData: AlertDataProps) {
    const { addAlert, alerts } = useAlert();
    return (
        <div>
            <button onClick={() => addAlert(alertData)} data-testid={`add-btn-${alertData.id}`}>Add</button>
            {alerts.map(a => <div key={a.id} data-testid={`msg-${a.id}`}>{a.message}</div>)}
        </div>
    );
}

describe('hook-alert', () => {
    jest.useFakeTimers();

    const testConsumer: AlertDataProps = {
        id: 'info',
        type: 'info',
        message: 'Info',
    };

    beforeEach(() => {
        (global as any).useBreakpointMock.mockImplementation(() => ({ isMobile: false }));
        jest.clearAllMocks();
    });

    describe('AlertContext', () => {
        it('default context returns empty add and empty alerts.', () => {
            let captured: any = {};
            function Dummy() {
                captured = useAlert();
                return null;
            }
            render(<Dummy />);
            expect(captured.addAlert).toBeInstanceOf(Function);
            expect(Array.isArray(captured.alerts)).toBe(true);
            expect(captured.alerts.length).toBe(0);
        });

        it('provider delivers alerts and addAlert coming from useAlertState.', async () => {
            const testConsumers: Array<AlertDataProps> = [
                testConsumer,
                {
                    id: 'info-custom-icon',
                    icon: 'lamp',
                    type: 'info',
                    message: 'Info Custom Icon',
                },
                {
                    id: 'error',
                    type: 'error',
                    message: 'Error',
                },
                {
                    id: 'error-custom-delay',
                    type: 'error',
                    message: 'Error Custom Delay',
                    delay: 1000,
                },
                {
                    id: 'warning',
                    type: 'warning',
                    message: 'Warning',
                },
                {
                    id: 'success',
                    type: 'success',
                    message: 'Success',
                },
            ]
            render(
                <AlertProvider>
                    {testConsumers.map((props, index) => (
                        <TestConsumer {...props} key={index} />
                    ))}
                </AlertProvider>
            );
            for (const item of testConsumers) {
                const btnModal = screen.getByTestId(`add-btn-${item.id}`);
                expect(btnModal).toBeInTheDocument()
                fireEvent.click(btnModal);
                await waitFor(() => {
                    const modal = screen.getByTestId(`alert-component-${item.id}`);
                    expect(modal).toBeInTheDocument();
                    expect(modal).toHaveTextContent(item.message as string);
                })
            }
        });

        it('onClose actions perform alert removal.', async () => {
            render(
                <AlertProvider>
                    <TestConsumer {...testConsumer} />
                </AlertProvider>
            );
            const btnModal = screen.getByTestId(`add-btn-${testConsumer.id}`);
            expect(btnModal).toBeInTheDocument()
            fireEvent.click(btnModal);
            const modal = screen.getByTestId(`alert-component-${testConsumer.id}`);
            expect(modal).toBeInTheDocument();
            expect(modal).toHaveTextContent(testConsumer.message as string);
            const btnClose = screen.getByTestId('mocked-ds-alert-icon-close')
            expect(btnClose).toBeInTheDocument();
            fireEvent.click(btnClose);
        });

        it('provider correctly applies default and custom styles.', () => {
            const styleCustom = { border: '1px solid red' };
            const { container } = render(
                <AlertProvider style={styleCustom}>
                    <TestConsumer {...testConsumer} />
                </AlertProvider>
            );

            const rootDiv = container.querySelector('div');
            expect(rootDiv).toHaveStyle('border: 1px solid red');
        });

        it('changes slide direction when isMobile is true.', () => {

            (global as any).useBreakpointMock.mockImplementation(() => ({ isMobile: true }));

            const { unmount } = render(
                <AlertProvider>
                    <TestConsumer {...testConsumer} />
                </AlertProvider>
            );

            fireEvent.click(screen.getByTestId(`add-btn-${testConsumer.id}`));
            expect(screen.getByTestId(`alert-component-${testConsumer.id}`)).toBeInTheDocument();

            unmount();
            jest.resetModules();
        });
    });

    describe('<AlertComponent/>', () => {
        const mockAlert = new Alert({ ...testConsumer, delay: 100 });
        const mockRemove = jest.fn();

        it('Must render and call "Remove" after delay.', () => {
            render(<AlertComponent alert={mockAlert} onRemove={mockRemove}/>);
            expect(screen.getByTestId(`alert-component-${testConsumer.id}`)).toHaveTextContent(testConsumer.message as string);

            act(() => {
                jest.advanceTimersByTime(101);
            });

            expect(mockRemove).toHaveBeenCalledWith(mockAlert);

        });
    });

    describe('useAlertState', () => {
        it('must add alerts correctly.', () => {
            const { result } = renderHook(() => useAlertState());
            act(() => {
                result.current.addAlert({ type: 'info', message: 'abc' });
                result.current.addAlert({ type: 'success', message: 'def' });
            });
            expect(result.current.alerts.length).toBe(2);
        });

        it('must start removal by setting visible=false, then remove from array.', () => {
            const { result } = renderHook(() => useAlertState());
            act(() => {
                result.current.addAlert({ type: 'info', message: 'xyz' });
            });
            const alert = result.current.alerts[0];
            act(() => {
                if(alert) {
                    result.current.removeAlert(alert);
                }
            });
            expect(result.current.alerts[0]?.visible).toBe(false);


            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(result.current.alerts.length).toBe(0);
        });

        it('must clear existing timeout when removing alert.', () => {
            const { result } = renderHook(() => useAlertState());

            act(() => {
                result.current.addAlert({ type: 'info', message: 'timeout-test' });
            });

            const alert = result.current.alerts[0];

            act(() => {
                if(alert) {
                    result.current.removeAlert(alert);
                }
            });

            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

            act(() => {
                if(alert) {
                    result.current.removeAlert(alert);
                }
            });

            expect(clearTimeoutSpy).toHaveBeenCalledWith(expect.any(Number));

            act(() => {
                jest.advanceTimersByTime(500);
            });

            expect(result.current.alerts.length).toBe(0);

            clearTimeoutSpy.mockRestore();
        });
    });
});