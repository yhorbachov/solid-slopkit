import './one-a.css';
import { createSignal, For } from 'solid-js';
import { Plus, Sun, Thermometer, Timer, Volume2 } from '@lucide/solid';
import {
  Badge,
  Button,
  Card,
  Chip,
  CloseButton,
  Loader,
  RingProgress,
  Select,
  Slider,
  Switch,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@solid-slopkit/ui';
import { Bars, QrCode } from '../charts';

const CURRENCIES = [
  { value: 'usd', label: 'USD — United States Dollar' },
  { value: 'eur', label: 'EUR — Euro' },
  { value: 'gbp', label: 'GBP — British Pound' },
  { value: 'jpy', label: 'JPY — Japanese Yen' },
];

const DIVIDENDS = [
  { name: 'Vanguard VIG', shares: 450, bars: [3, 3, 3, 4], amount: '$1,842.10' },
  { name: 'S&P 500 VOO', shares: 112, bars: [2, 3, 4, 3], amount: '$928.40' },
  { name: 'Apple AAPL', shares: 85, bars: [2, 3, 4, 4], amount: '$340.00' },
  { name: 'Realty Income', shares: 320, bars: [3, 3, 3, 4], amount: '$1,139.50' },
];

const LIGHTS = [
  { label: 'Brightness', icon: Sun, value: 90 },
  { label: 'Color Temp', icon: Thermometer, value: 70 },
  { label: 'Volume', icon: Volume2, value: 30 },
  { label: 'Fade', icon: Timer, value: 0 },
];

function Heading(props: { title: string; subtitle?: string }) {
  return (
    <div>
      <Title order={3} size="h5">
        {props.title}
      </Title>
      {props.subtitle && (
        <Text size="sm" dimmed>
          {props.subtitle}
        </Text>
      )}
    </div>
  );
}

export function Column1() {
  return (
    <>
      <Card>
        <Card.Header>
          <Heading title="Contribution History" subtitle="Last 6 months of activity" />
        </Card.Header>
        <Card.Body class="create-one-a-stack">
          <Bars
            values={[48, 66, 57, 82, 45, 88]}
            labels={['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']}
            height="9rem"
            class="create-one-a-history"
          />
          <div class="create-one-a-split">
            <div class="create-inset">
              <p class="create-eyebrow">Upcoming</p>
              <Text weight="semibold">May 25, 2024</Text>
              <Text size="xs" dimmed>
                $1,000 scheduled
              </Text>
            </div>
            <div class="create-inset">
              <p class="create-eyebrow">Auto-Save Plan</p>
              <Text weight="semibold">Accelerated</Text>
              <Text size="xs" dimmed>
                Recurring weekly
              </Text>
            </div>
          </div>
        </Card.Body>
        <Card.Footer class="create-one-a-footer">
          <Button size="sm" color="primary" fullWidth>
            View Full Report
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Body class="create-empty">
          <span class="create-one-a-icon-box" aria-hidden="true">
            <Plus />
          </span>
          <Title order={3} size="h6">
            Distribute Track
          </Title>
          <Text size="sm" dimmed>
            Upload your first master to start reaching listeners on streaming services, and more.
          </Text>
          <Button size="sm" variant="outline">
            Create Release
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body class="create-empty">
          <QrCode size="9rem" />
          <Title order={3} size="h6">
            Scan to connect your mobile device
          </Title>
          <Text size="sm" dimmed>
            Open the Acme mobile app and scan this code to link your device.
          </Text>
        </Card.Body>
        <Card.Footer class="create-one-a-footer">
          <Button size="sm" variant="soft" fullWidth>
            Got it
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <Heading title="Q2 Dividend Income" subtitle="Quarterly dividend payouts across your portfolio holdings." />
          <CloseButton size="sm" />
        </Card.Header>
        <Card.Body class="create-one-a-list">
          <For each={DIVIDENDS}>
            {(row) => (
              <div class="create-inset create-one-a-row">
                <div>
                  <Text size="sm" weight="medium">
                    {row.name}
                  </Text>
                  <Text size="xs" dimmed>
                    {row.shares} Shares
                  </Text>
                </div>
                <div class="create-one-a-row-end">
                  <Bars values={row.bars} height="1.125rem" color="var(--create-chart-2)" class="create-one-a-spark" />
                  <Text size="sm" weight="semibold" class="create-one-a-amount">
                    {row.amount}
                  </Text>
                </div>
              </div>
            )}
          </For>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Heading title="Dollar-Cost Averaging" subtitle="A strategy for building wealth over time." />
        </Card.Header>
        <Card.Body>
          <Text size="sm" dimmed>
            <Tooltip label="Usually months or years of regular, fixed contributions">
              {(target) => (
                <button {...target} type="button" class="create-one-a-term">
                  Over time
                </button>
              )}
            </Tooltip>
            , this smooths out the average cost of your investments. When prices drop, your fixed amount buys more shares. When
            prices rise, you buy fewer. The result is a lower average cost per share compared to lump-sum investing during
            volatile periods.
          </Text>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body class="create-empty">
          <Loader size="sm" label="Syncing" class="create-muted" />
          <Title order={3} size="h6">
            Syncing your accounts
          </Title>
          <Text size="sm" dimmed>
            We're pulling in your latest transactions. This usually takes a few seconds.
          </Text>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export function Column2() {
  const [payout, setPayout] = createSignal(2500, { name: 'payoutThreshold' });
  const money = (value: number) => `$${value.toLocaleString('en-US')}`;

  return (
    <>
      <Card>
        <Card.Header>
          <Heading title="Payout Threshold" subtitle="Set the minimum balance required before a payout is triggered." />
          <CloseButton size="sm" />
        </Card.Header>
        <Card.Body class="create-one-a-stack">
          <Select label="Preferred Currency" size="sm" data={CURRENCIES} defaultValue="usd" />
          <div>
            <Slider
              class="create-one-a-payout"
              label={
                <>
                  <span>Minimum Payout Amount</span>
                  <span class="create-one-a-payout-value" aria-hidden="true">
                    ${payout().toFixed(2)}
                  </span>
                </>
              }
              min={50}
              max={10000}
              value={payout()}
              onChange={setPayout}
              valueLabel={null}
              valueText={money}
            />
            <div class="create-one-a-range create-muted">
              <span>$50 (MIN)</span>
              <span>$10,000 (MAX)</span>
            </div>
          </div>
          <Textarea label="Notes" size="sm" rows={3} placeholder="Add any notes for this payout configuration..." />
        </Card.Body>
        <Card.Footer class="create-one-a-footer">
          <Button size="sm" color="primary" fullWidth>
            Save Threshold
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Body class="create-one-a-stack">
          <div>
            <Text size="sm" dimmed>
              Claimable Balance
            </Text>
            <p class="create-figure create-one-a-balance">$0.00</p>
            <Badge size="sm" variant="soft" leftSection={<span class="create-one-a-dot" aria-hidden="true" />}>
              Pending Setup
            </Badge>
          </div>
          <div class="create-inset">
            <div class="create-kv">
              <span class="create-muted">Net Royalties</span>
              <span>$0.00</span>
            </div>
            <div class="create-kv">
              <span class="create-muted">Processing Fee</span>
              <span>-$0.00</span>
            </div>
            <div class="create-kv">
              <span class="create-muted">Total Ready to Claim</span>
              <strong>$0.00 USD</strong>
            </div>
          </div>
        </Card.Body>
        <Card.Footer class="create-one-a-footer create-one-a-footer-text">
          <Text size="sm" dimmed>
            Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution on the 15th of
            each month.
          </Text>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <Heading title="Preferences" subtitle="Manage your account settings and notifications." />
          <CloseButton size="sm" />
        </Card.Header>
        <Card.Body class="create-one-a-stack">
          <Select label="Default Currency" size="sm" data={CURRENCIES} defaultValue="usd" />
          <div>
            <Switch
              class="create-one-a-setting"
              labelPosition="left"
              size="sm"
              label="Public Statistics"
              description="Allow others to see your total stream count and listening activity"
              defaultChecked
            />
            <Switch
              class="create-one-a-setting"
              labelPosition="left"
              size="sm"
              label="Email Notifications"
              description="Monthly royalty reports and distribution updates"
              defaultChecked
            />
          </div>
        </Card.Body>
        <Card.Footer class="create-one-a-footer create-one-a-footer-split">
          <Button size="sm" variant="outline">
            Reset
          </Button>
          <Button size="sm" color="primary">
            Save Preferences
          </Button>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Body class="create-one-a-donut">
          <RingProgress value={80} size="xl" label="Savings goal" class="create-one-a-ring">
            <span class="create-one-a-ring-value">$24,000</span>
            <span class="create-one-a-ring-caption create-muted">80% of $30,000</span>
          </RingProgress>
        </Card.Body>
        <Card.Body class="create-one-a-divided">
          <div class="create-kv">
            <span class="create-muted">Projected Finish</span>
            <strong>October 2024</strong>
          </div>
          <div class="create-kv">
            <span class="create-muted">Monthly Average</span>
            <strong>$1,250</strong>
          </div>
          <div class="create-kv">
            <span class="create-muted">Top Contributor</span>
            <strong>Auto-Transfer</strong>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Heading title="Kitchen Island" subtitle="Hue Color Ambient" />
          <Switch aria-label="Kitchen Island light" size="sm" defaultChecked />
        </Card.Header>
        <Card.Body class="create-one-a-stack">
          <Chip.Group aria-label="Scene" size="sm" defaultValue="cooking">
            <Chip value="cooking">Cooking</Chip>
            <Chip value="dining">Dining</Chip>
            <Chip value="nightlight">Nightlight</Chip>
            <Chip value="focus">Focus</Chip>
          </Chip.Group>
          <div class="create-one-a-lights">
            <For each={LIGHTS}>
              {(light) => (
                <Slider
                  class="create-one-a-light"
                  size="sm"
                  label={
                    <>
                      <light.icon aria-hidden="true" />
                      {light.label}
                    </>
                  }
                  defaultValue={light.value}
                  valueLabel={null}
                />
              )}
            </For>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
