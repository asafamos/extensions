import {
  ActionPanel,
  Action,
  List,
  Detail,
  Icon,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";

type AxeViolation = {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor" | null;
  help: string;
  description: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
};

type ScanResult = {
  url: string;
  title: string;
  violations: AxeViolation[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
};

const AXLE_API = "https://axle-iota.vercel.app";

const IMPACT_ICON: Record<string, { source: Icon; tintColor?: string }> = {
  critical: { source: Icon.ExclamationMark, tintColor: "#dc2626" },
  serious: { source: Icon.Warning, tintColor: "#ea580c" },
  moderate: { source: Icon.Info, tintColor: "#d97706" },
  minor: { source: Icon.Circle, tintColor: "#2563eb" },
};

export default function Scan(props: { arguments: { url: string } }) {
  const { url } = props.arguments;
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    showToast({ style: Toast.Style.Animated, title: "Scanning", message: normalized });
    fetch(`${AXLE_API}/api/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalized }),
    })
      .then(async (r) => {
        const data = (await r.json()) as ScanResult & { error?: string };
        if (!r.ok || data.error) throw new Error(data.error || `HTTP ${r.status}`);
        setResult(data);
        showToast({
          style: Toast.Style.Success,
          title: `${data.violations.length} violations`,
          message: normalized,
        });
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Scan failed";
        setError(msg);
        showToast({ style: Toast.Style.Failure, title: "Scan failed", message: msg });
      })
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return <List isLoading={true} searchBarPlaceholder="Scanning…" />;
  }

  if (error) {
    return (
      <Detail markdown={`# Scan failed\n\n${error}`} />
    );
  }

  if (!result) return null;

  return (
    <List
      navigationTitle={`${result.title || result.url} — ${result.violations.length} rules`}
      searchBarPlaceholder="Filter violations"
    >
      <List.Section title="Summary">
        <List.Item
          title={`${result.summary.critical} critical · ${result.summary.serious} serious · ${result.summary.moderate} moderate · ${result.summary.minor} minor`}
          icon={Icon.BarChart}
        />
      </List.Section>
      <List.Section title="Violations">
        {result.violations.map((v) => (
          <List.Item
            key={v.id}
            title={v.help}
            subtitle={v.id}
            accessories={[
              { text: `${v.nodes.length} element${v.nodes.length === 1 ? "" : "s"}` },
              { tag: v.impact ?? "minor" },
            ]}
            icon={IMPACT_ICON[v.impact ?? "minor"]}
            actions={
              <ActionPanel>
                <Action.Push title="View Details" target={<ViolationDetail violation={v} />} />
                <Action.OpenInBrowser title="Open WCAG Reference" url={v.helpUrl} />
                <Action.CopyToClipboard
                  title="Copy Rule ID"
                  content={v.id}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function ViolationDetail({ violation }: { violation: AxeViolation }) {
  const first = violation.nodes[0];
  const md = [
    `# ${violation.help}`,
    "",
    `**Rule:** \`${violation.id}\` · **Impact:** ${violation.impact ?? "minor"}`,
    "",
    violation.description,
    "",
    `---`,
    "",
    `## First affected element`,
    "",
    `\`${first?.target.join(" ")}\``,
    "",
    "```html",
    first?.html ?? "",
    "```",
    "",
    first?.failureSummary ? `> ${first.failureSummary}` : "",
    "",
    `---`,
    "",
    `${violation.nodes.length} element(s) affected in total. [Open full report →](${AXLE_API}/)`,
  ].join("\n");

  return (
    <Detail
      markdown={md}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser title="Open WCAG Reference" url={violation.helpUrl} />
          <Action.CopyToClipboard
            title="Copy Element HTML"
            content={first?.html ?? ""}
          />
        </ActionPanel>
      }
    />
  );
}
