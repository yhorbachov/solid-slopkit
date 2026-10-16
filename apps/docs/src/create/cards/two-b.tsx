import { For } from 'solid-js';
import type { JSX } from '@solidjs/web';
import {
  Anchor,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Progress,
  RingProgress,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@solid-slopkit/ui';
import { StackedBars } from '../charts';
import './two-b.css';

// A card header: the title with an optional subtitle under it, and anything else at the end.
function Head(props: { title: JSX.Element; subtitle?: string; children?: JSX.Element }) {
  return (
    <Card.Header>
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
      {props.children}
    </Card.Header>
  );
}

function LoadingProfile() {
  return (
    <Card>
      <Card.Body aria-busy="true" aria-label="Loading profile">
        <Stack gap={4}>
          <Group gap={3} wrap="nowrap">
            <Skeleton circle style={{ width: '2.5rem', height: '2.5rem', 'flex-shrink': 0 }} />
            <Stack gap={2} class="create-two-b-grow">
              <Skeleton style={{ height: '0.75rem', width: '70%' }} />
              <Skeleton style={{ height: '0.75rem', width: '45%' }} />
            </Stack>
          </Group>
          <Stack gap={2}>
            <Skeleton style={{ height: '0.75rem' }} />
            <Skeleton style={{ height: '0.75rem' }} />
            <Skeleton style={{ height: '0.75rem', width: '80%' }} />
          </Stack>
          <Group gap={2}>
            <Skeleton style={{ height: '2rem', width: '5rem' }} />
            <Skeleton style={{ height: '2rem', width: '5rem' }} />
          </Group>
        </Stack>
      </Card.Body>
    </Card>
  );
}

const BROWSERS = ['Chrome', 'Edge', 'Firefox', 'Safari'];

function BrowserShare() {
  return (
    <Card>
      <Head title="Browser Share" subtitle="January - June 2026">
        <Badge variant="outline">Firefox</Badge>
      </Head>
      <Card.Body>
        <Stack gap={4} align="center">
          <RingProgress value={70} size="xl" label="Browser share" class="create-two-b-donut">
            <span class="create-two-b-donut-value">935</span>
            <span class="create-two-b-donut-label">Visitors</span>
          </RingProgress>
          <ul class="create-two-b-legend">
            <For each={BROWSERS}>
              {(browser, i) => (
                <li>
                  <span class="create-two-b-dot" style={{ background: `var(--create-chart-${i() + 1})` }} />
                  {browser}
                </li>
              )}
            </For>
          </ul>
        </Stack>
      </Card.Body>
      <Card.Footer class="create-two-b-stack">
        <div class="create-kv">
          <span id="create-two-b-firefox">Firefox</span>
          <span class="create-muted">31%</span>
        </div>
        <Progress value={31} size="xs" aria-labelledby="create-two-b-firefox" />
      </Card.Footer>
    </Card>
  );
}

function NoTeamMembers() {
  return (
    <Card>
      <Card.Body>
        <div class="create-empty create-two-b-dashed">
          <Avatar.Group>
            <Avatar name="Maya Lin" alt="" />
            <Avatar name="Omar Diaz" color="primary" alt="" />
            <Avatar name="Kai Sato" color="neutral" variant="solid" alt="" />
          </Avatar.Group>
          <Title order={3} size="h6">
            No Team Members
          </Title>
          <Text size="sm" dimmed>
            Invite your team to collaborate on this project.
          </Text>
          <Button size="sm">Invite Members</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function ReportBug() {
  return (
    <Card>
      <Head title="Report Bug" subtitle="Help us fix issues faster." />
      <Card.Body>
        <Stack gap={4}>
          <TextInput label="Title" placeholder="Brief description of the issue" />
          <SimpleGrid cols={2} spacing={3}>
            <Select label="Severity" defaultValue="Medium" data={['Low', 'Medium', 'High', 'Critical']} />
            <Select label="Component" defaultValue="Dashboard" data={['Dashboard', 'Billing', 'API', 'Settings']} />
          </SimpleGrid>
          <Textarea label="Steps to reproduce" placeholder={'1. Go to\n2. Click on\n3. Observe...'} rows={3} />
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button size="sm" variant="outline">
          Attach File
        </Button>
        <Button size="sm">Submit Bug</Button>
      </Card.Footer>
    </Card>
  );
}

const CONTRIBUTORS: { name: string; color?: 'primary' | 'secondary' | 'neutral' }[] = [
  { name: 'Ana Ruiz' },
  { name: 'Ben Okafor', color: 'neutral' },
  { name: 'Chen Wei', color: 'primary' },
  { name: 'Dara Kim' },
  { name: 'Eli Novak', color: 'secondary' },
  { name: 'Fay Moreau' },
  { name: 'Gus Lindqvist', color: 'neutral' },
  { name: 'Hana Ito', color: 'primary' },
  { name: 'Ivo Petrov' },
  { name: 'Jade Nkosi', color: 'secondary' },
  { name: 'Kofi Mensah', color: 'neutral' },
  { name: 'Lea Fischer' },
  { name: 'Milo Grant', color: 'primary' },
  { name: 'Nia Adeyemi' },
  { name: 'Oren Shapiro', color: 'secondary' },
  { name: 'Pia Costa', color: 'neutral' },
];

function Contributors() {
  return (
    <Card>
      <Card.Header class="create-two-b-start">
        <Title order={3} size="h5">
          Contributors
        </Title>
        <Badge variant="soft" size="sm">
          312
        </Badge>
      </Card.Header>
      <Card.Body>
        <div class="create-two-b-avatars" role="group" aria-label="Top contributors">
          <For each={CONTRIBUTORS}>{(person) => <Avatar size="sm" name={person.name} color={person.color} />}</For>
        </div>
      </Card.Body>
      <Card.Footer class="create-two-b-start">
        <Anchor href="#" size="sm" color="neutral">
          + 810 contributors
        </Anchor>
      </Card.Footer>
    </Card>
  );
}

export function Column4() {
  return (
    <>
      <LoadingProfile />
      <BrowserShare />
      <NoTeamMembers />
      <ReportBug />
      <Contributors />
    </>
  );
}

const TOPICS = [
  'AI',
  'Accounts and Access Controls',
  'Billing',
  'CDN (Firewall, Caching)',
  'CI/CD (Builds, Deployments, Environment Variables)',
  'Dashboard Interface (Navigation, UI Issues)',
  'Domains',
  'Frameworks',
  'Marketplace and Integrations',
  'Observability (Observability, Logs, Monitoring)',
  'Storage',
];

function TopicFeedback() {
  return (
    <Card>
      <Card.Body>
        <Stack gap={4}>
          <Select label="Topic" placeholder="Select a topic" data={TOPICS} />
          <Textarea label="Feedback" placeholder="Your feedback helps us improve..." rows={2} />
        </Stack>
      </Card.Body>
      <Card.Footer class="create-two-b-start">
        <Button size="sm">Submit</Button>
      </Card.Footer>
    </Card>
  );
}

function BookAppointment() {
  return (
    <Card>
      <Head title="Book Appointment" subtitle="Dr. Sarah Chen · Cardiology" />
      <Card.Body>
        <Stack gap={3}>
          <Text size="sm" weight="medium" id="create-two-b-slots">
            Available on March 18, 2026
          </Text>
          <SegmentedControl
            class="create-two-b-slots"
            aria-labelledby="create-two-b-slots"
            data={['9:00 AM', '10:30 AM', '11:00 AM', '1:30 PM']}
            size="sm"
            fullWidth
            withItemsBorders={false}
          />
          <div class="create-two-b-note">
            <Text size="sm" weight="medium">
              New patient?
            </Text>
            <Text size="sm" dimmed>
              Please arrive 15 minutes early.
            </Text>
          </div>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button size="sm" fullWidth>
          Book Appointment
        </Button>
      </Card.Footer>
    </Card>
  );
}

// Deep, light and REM sleep per hour of the night.
const SLEEP = [
  [0, 3, 0],
  [0, 2, 1],
  [6, 1, 2],
  [5, 2, 2],
  [1, 6, 3],
  [3, 4, 1],
  [1, 6, 2],
  [0, 4, 3],
];

const SLEEP_STATS = [
  { value: '2h 10m', label: 'Deep' },
  { value: '3h 48m', label: 'Light' },
  { value: '1h 26m', label: 'REM' },
  { value: '84', label: 'Score' },
];

function SleepReport() {
  return (
    <Card>
      <Head title="Sleep Report" subtitle="Last night · 7h 24m" />
      <Card.Body>
        <Stack gap={4}>
          <StackedBars stacks={SLEEP} height="9rem" />
          <dl class="create-two-b-stats">
            <For each={SLEEP_STATS}>
              {(stat) => (
                <div>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              )}
            </For>
          </dl>
        </Stack>
      </Card.Body>
      <Card.Footer class="create-two-b-split">
        <Badge variant="soft" size="sm">
          Good
        </Badge>
        <Button size="xs" variant="outline">
          Details
        </Button>
      </Card.Footer>
    </Card>
  );
}

// Help text under a field rather than between its label and the field.
function Help(props: { id: string; children: JSX.Element }) {
  return (
    <Text size="sm" dimmed id={props.id} class="create-two-b-help">
      {props.children}
    </Text>
  );
}

function Profile() {
  return (
    <Card>
      <Head title="Profile" subtitle="Manage your profile information." />
      <Card.Body>
        <Stack gap={4}>
          <div>
            <TextInput label="Name" placeholder="slopkit" aria-describedby="create-two-b-name-help" />
            <Help id="create-two-b-name-help">
              Your name may appear around the platform where you contribute or are mentioned. You can remove it at any time.
            </Help>
          </div>
          <div>
            <Select
              label="Public Email"
              defaultValue="m@slopkit.dev"
              data={['m@slopkit.dev', 'm@example.com']}
              aria-describedby="create-two-b-email-help"
            />
            <Help id="create-two-b-email-help">
              You can manage verified email addresses in your{' '}
              <Anchor href="#" color="neutral">
                email settings
              </Anchor>
              .
            </Help>
          </div>
          <div>
            <Textarea
              label="Bio"
              placeholder="Tell us a little bit about yourself"
              rows={2}
              aria-describedby="create-two-b-bio-help"
            />
            <Help id="create-two-b-bio-help">You can @mention other users and organizations to link to them.</Help>
          </div>
        </Stack>
      </Card.Body>
      <Card.Footer class="create-two-b-start">
        <Button size="sm">Save Profile</Button>
      </Card.Footer>
    </Card>
  );
}

export function Column5() {
  return (
    <>
      <TopicFeedback />
      <BookAppointment />
      <SleepReport />
      <Profile />
    </>
  );
}
