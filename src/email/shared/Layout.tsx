import { Body, Container, Head, Html, Img, Preview, Section, Text } from "jsx-email";
import type { PropsWithChildren, ReactNode } from "react";
import { BaseStyles, BrandStyles, getStyles } from ".";

const baseUrl = import.meta.isJsxEmailPreview ? "/assets" : "${url.resourcesUrl}";

export const EmailLayout = ({
    locale,
    children,
    preview
}: PropsWithChildren<{
    preview?: ReactNode;
    locale: string;
}>) => {
    return (
        <Html lang={locale}>
            <Head />
            {preview && (
                <Preview>{preview}</Preview>
            )}
            <Body style={getStyles(BaseStyles.Layout)}>
                <Container style={getStyles(BaseStyles.Main)}>
                    <Section style={getStyles(BaseStyles.Header)}>
                        <Container style={getStyles(BaseStyles.Logo)}>
                            <Img
                                src={`${baseUrl}/wordmark.png`}
                                alt="Clean Sight Solutions Logo"
                                width="300"
                            />
                        </Container>
                    </Section>
                    <Section style={getStyles(BaseStyles.Body)}>{children}</Section>
                </Container>
                <Container
                    style={getStyles(
                        BaseStyles.Main,
                        {},
                        { paddingTop: BrandStyles.BaseSize_5xPx }
                    )}
                >
                    <Section style={getStyles(BaseStyles.Footer)}>
                        <Text>
                            Copyright &copy; {new Date().getFullYear()}{" "}
                            <strong>CleanSight</strong>Solutions
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};
