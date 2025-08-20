import { Body, Container, Head, Html, Img, Preview, Section } from "jsx-email";
import type { PropsWithChildren, ReactNode } from "react";

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    marginBottom: "64px",
    padding: "20px 0 48px"
};

const box = {
    padding: "0 48px"
};

const baseUrl = import.meta.isJsxEmailPreview ? "/assets" : "${url.resourcesUrl}";

export const EmailLayout = ({
    locale,
    children,
    preview
}: PropsWithChildren<{ preview: ReactNode; locale: string }>) => {
    return (
        <Html lang={locale}>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Container>
                            <Img
                                src={`${baseUrl}/wordmark.png`}
                                alt="Clean Sight Solutions Logo"
                                width="274"
                                height="30"
                            />
                        </Container>
                        {children}
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};
