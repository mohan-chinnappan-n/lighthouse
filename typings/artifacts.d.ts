/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import * as parseManifest from '../lighthouse-core/lib/manifest-parser.js';
import * as _LanternSimulator from '../lighthouse-core/lib/dependency-graph/simulator/simulator.js';
import speedline = require('speedline');

type LanternSimulator = InstanceType<typeof _LanternSimulator>;

declare global {
  module LH {
    export interface Artifacts extends ComputedArtifacts {
      // Created by by gather-runner
      fetchedAt: string;
      LighthouseRunWarnings: string[];
      UserAgent: string;
      traces: {[passName: string]: Trace};
      devtoolsLogs: {[passName: string]: DevtoolsLog};
      settings: Config.Settings;

      // Remaining are provided by default gatherers.
      /** The results of running the aXe accessibility tests on the page. */
      Accessibility: Artifacts.Accessibility;
      /** Information on all anchors in the page that aren't nofollow or noreferrer. */
      AnchorsWithNoRelNoopener: {href: string; rel: string; target: string}[];
      /** The value of the page's <html> manifest attribute, or null if not defined */
      AppCacheManifest: string | null;
      /** Array of all URLs cached in CacheStorage. */
      CacheContents: string[];
      /** Href values of link[rel=canonical] nodes found in HEAD (or null, if no href attribute). */
      Canonical: (string | null)[];
      /** Console deprecation and intervention warnings logged by Chrome during page load. */
      ChromeConsoleMessages: Crdp.Log.EntryAddedEvent[];
      /** The href and innerText of all non-nofollow anchors in the page. */
      CrawlableLinks: {href: string, text: string}[];
      /** CSS coverage information for styles used by page's final state. */
      CSSUsage: {rules: Crdp.CSS.RuleUsage[], stylesheets: Artifacts.CSSStyleSheetInfo[]};
      /** Information on the size of all DOM nodes in the page and the most extreme members. */
      DOMStats: Artifacts.DOMStats;
      /** Relevant attributes and child properties of all <object>s, <embed>s and <applet>s in the page. */
      EmbeddedContent: Artifacts.EmbeddedContentInfo[];
      /** Information on all event listeners in the page. */
      EventListeners: {url: string, type: string, handler?: {description?: string}, objectName: string, line: number, col: number}[];
      /** Information for font faces used in the page. */
      Fonts: Artifacts.Font[];
      /** Information on poorly sized font usage and the text affected by it. */
      FontSize: Artifacts.FontSize;
      /** The hreflang and href values of all link[rel=alternate] nodes found in HEAD. */
      Hreflang: {href: string, hreflang: string}[];
      /** The page's document body innerText if loaded with JavaScript disabled. */
      HTMLWithoutJavaScript: {value: string};
      /** Whether the page ended up on an HTTPS page after attempting to load the HTTP version. */
      HTTPRedirect: {value: boolean};
      /** Information on size and loading for all the images in the page. */
      ImageUsage: Artifacts.SingleImageUsage[];
      /** Information on JS libraries and versions used by the page. */
      JSLibraries: {name: string, version: string, npmPkgName: string}[];
      /** JS coverage information for code used during page load. */
      JsUsage: Crdp.Profiler.ScriptCoverage[];
      /** Parsed version of the page's Web App Manifest, or null if none found. */
      Manifest: Artifacts.Manifest | null;
      /** The value of the <meta name="description">'s content attribute, or null. */
      MetaDescription: string|null;
      /** The value of the <meta name="robots">'s content attribute, or null. */
      MetaRobots: string|null;
      /** The status code of the attempted load of the page while network access is disabled. */
      Offline: number;
      /** Size and compression opportunity information for all the images in the page. */
      OptimizedImages: Artifacts.OptimizedImage[];
      /** HTML snippets from any password inputs that prevent pasting. */
      PasswordInputsWithPreventedPaste: {snippet: string}[];
      /** Size info of all network records sent without compression and their size after gzipping. */
      ResponseCompression: {requestId: string, url: string, mimeType: string, transferSize: number, resourceSize: number, gzipSize: number}[];
      /** Information on fetching and the content of the /robots.txt file. */
      RobotsTxt: {status: number|null, content: string|null};
      /** Set of exceptions thrown during page load. */
      RuntimeExceptions: Crdp.Runtime.ExceptionThrownEvent[];
      /** The content of all scripts loaded by the page, keyed by networkRecord requestId. */
      Scripts: Record<string, string>;
      /** Version information for all ServiceWorkers active after the first page load. */
      ServiceWorker: {versions: Crdp.ServiceWorker.ServiceWorkerVersion[]};
      /** The status of an offline fetch of the page's start_url. -1 and a debugString if missing or there was an error. */
      StartUrl: {statusCode: number, debugString?: string};
      /** Information on <script> and <link> tags blocking first paint. */
      TagsBlockingFirstPaint: Artifacts.TagBlockingFirstPaint[];
      /** The value of the <meta name="theme=color">'s content attribute, or null. */
      ThemeColor: string|null;
      /** The URL initially supplied to be loaded and the post-redirects URL that was loaded. */
      URL: {initialUrl: string, finalUrl: string};
      /** The value of the <meta name="viewport">'s content attribute, or null. */
      Viewport: string|null;
      /** The dimensions and devicePixelRatio of the loaded viewport. */
      ViewportDimensions: Artifacts.ViewportDimensions;
      /** WebSQL database information for the page or null if none was found. */
      WebSQL: Crdp.Database.Database | null;
    }

    export interface ComputedArtifacts {
      requestDevtoolsTimelineModel(trace: Trace): Promise<{filmStripModel(): Artifacts.DevtoolsTimelineFilmStripModel}>;
      requestLoadSimulator(data: {devtoolsLog: DevtoolsLog, settings: Config.Settings}): Promise<LanternSimulator>;
      requestMainResource(data: {devtoolsLog: DevtoolsLog, URL: Artifacts['URL']}): Promise<WebInspector.NetworkRequest>;
      requestManifestValues(manifest: LH.Artifacts['Manifest']): Promise<LH.Artifacts.ManifestValues>;
      requestNetworkAnalysis(devtoolsLog: DevtoolsLog): Promise<LH.Artifacts.NetworkAnalysis>;
      requestNetworkThroughput(devtoolsLog: DevtoolsLog): Promise<number>;
      requestNetworkRecords(devtoolsLog: DevtoolsLog): Promise<WebInspector.NetworkRequest[]>;
      requestPageDependencyGraph(data: {trace: Trace, devtoolsLog: DevtoolsLog}): Promise<Gatherer.Simulation.GraphNode>;
      requestPushedRequests(devtoolsLogs: DevtoolsLog): Promise<WebInspector.NetworkRequest[]>;
      requestTraceOfTab(trace: Trace): Promise<Artifacts.TraceOfTab>;
      requestScreenshots(trace: Trace): Promise<{timestamp: number, datauri: string}[]>;
      requestSpeedline(trace: Trace): Promise<LH.Artifacts.Speedline>;

      // Metrics.
      requestConsistentlyInteractive(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;
      requestEstimatedInputLatency(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;
      requestFirstContentfulPaint(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;
      requestFirstCPUIdle(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;
      requestFirstMeaningfulPaint(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;
      requestSpeedIndex(data: LH.Artifacts.MetricComputationDataInput): Promise<Artifacts.LanternMetric|Artifacts.Metric>;

      // Lantern metrics.
      requestLanternConsistentlyInteractive(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
      requestLanternEstimatedInputLatency(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
      requestLanternFirstContentfulPaint(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
      requestLanternFirstCPUIdle(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
      requestLanternFirstMeaningfulPaint(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
      requestLanternSpeedIndex(data: LH.Artifacts.MetricComputationData): Promise<Artifacts.LanternMetric>;
    }

    module Artifacts {
      export interface Accessibility {
        violations: {
          id: string;
          nodes: {
            path: string;
            snippet: string;
            target: string[];
          }[];
        }[];
        notApplicable: {
          id: string
        }[];
      }

      export interface CSSStyleSheetInfo {
        header: Crdp.CSS.CSSStyleSheetHeader;
        content: string;
      }

      export interface DOMStats {
        totalDOMNodes: number;
        width: {max: number, pathToElement: Array<string>, snippet: string};
        depth: {max: number, pathToElement: Array<string>, snippet: string};
      }

      export interface EmbeddedContentInfo {
        tagName: string;
        type: string | null;
        src: string | null;
        data: string | null;
        code: string | null;
        params: {name: string; value: string}[];
      }

      export interface Font {
        display: string;
        family: string;
        featureSettings: string;
        stretch: string;
        style: string;
        unicodeRange: string;
        variant: string;
        weight: string;
        src?: string[];
      }

      export interface FontSize {
        totalTextLength: number;
        failingTextLength: number;
        visitedTextLength: number;
        analyzedFailingTextLength: number;
        analyzedFailingNodesData: {
          fontSize: number;
          textLength: number;
          node: FontSize.DomNodeWithParent;
          cssRule: {
            type: string;
            range: {startLine: number, startColumn: number};
            parentRule: {origin: string, selectors: {text: string}[]};
            styleSheetId: string;
            stylesheet: Crdp.CSS.CSSStyleSheetHeader;
          }
        }
      }

      export module FontSize {
        export interface DomNodeWithParent extends Crdp.DOM.Node {
          parentId: number;
          parentNode: DomNodeWithParent;
        }
      }

      // TODO(bckenny): real type for parsed manifest.
      export type Manifest = ReturnType<typeof parseManifest>;

      export interface SingleImageUsage {
        src: string;
        clientWidth: number;
        clientHeight: number;
        naturalWidth: number;
        naturalHeight: number;
        isCss: boolean;
        isPicture: boolean;
        usesObjectFit: boolean;
        clientRect: {
          top: number;
          bottom: number;
          left: number;
          right: number;
        };
        networkRecord: {
          url: string;
          resourceSize: number;
          startTime: number;
          endTime: number;
          responseReceivedTime: number;
          mimeType: string;
        }
      }

      export interface OptimizedImage {
        isSameOrigin: boolean;
        isBase64DataUri: boolean;
        requestId: string;
        url: string;
        mimeType: string;
        resourceSize: number;
        fromProtocol?: boolean;
        originalSize?: number;
        jpegSize?: number;
        webpSize?: number;
        failed?: boolean;
        err?: Error;
      }

      export interface TagBlockingFirstPaint {
        startTime: number;
        endTime: number;
        transferSize: number;
        tag: {
          tagName: string;
          url: string;
        };
      }

      export interface ViewportDimensions {
        innerWidth: number;
        innerHeight: number;
        outerWidth: number;
        outerHeight: number;
        devicePixelRatio: number;
      }

      // Computed artifact types below.
      export type CriticalRequestNode = {
        [id: string]: {
          request: WebInspector.NetworkRequest;
          children: CriticalRequestNode;
        }
      }

      export interface DevtoolsTimelineFilmStripModel {
        frames(): Array<{
          imageDataPromise(): Promise<string>;
          timestamp: number;
        }>;
      }

      export interface ManifestValues {
        isParseFailure: boolean;
        parseFailureReason: string | undefined;
        allChecks: {
          id: string;
          failureText: string;
          passing: boolean;
        }[];
      }

      export interface MetricComputationDataInput {
        devtoolsLog: DevtoolsLog;
        trace: Trace;
        settings: Config.Settings;
      }

      export interface MetricComputationData extends MetricComputationDataInput {
        networkRecords: Array<WebInspector.NetworkRequest>;
        traceOfTab: TraceOfTab;
        simulator?: LanternSimulator;
      }

      export interface Metric {
        timing: number;
        timestamp?: number;
      }

      export interface NetworkAnalysis {
        rtt: number;
        additionalRttByOrigin: Map<string, number>;
        serverResponseTimeByOrigin: Map<string, number>;
        throughput: number;
      }

      export interface LanternMetric {
        timing: number;
        optimisticEstimate: Gatherer.Simulation.Result
        pessimisticEstimate: Gatherer.Simulation.Result;
        optimisticGraph: Gatherer.Simulation.GraphNode;
        pessimisticGraph: Gatherer.Simulation.GraphNode;
      }

      export type Speedline = speedline.Output<'speedIndex'>;

      // TODO(bckenny): all but navigationStart could actually be undefined.
      export interface TraceTimes {
        navigationStart: number;
        firstPaint: number;
        firstContentfulPaint: number;
        firstMeaningfulPaint: number;
        traceEnd: number;
        load: number;
        domContentLoaded: number;
      }

      // TODO(bckenny): events other than started and navStart could be undefined.
      export interface TraceOfTab {
        timings: TraceTimes;
        timestamps: TraceTimes;
        processEvents: Array<TraceEvent>;
        mainThreadEvents: Array<TraceEvent>;
        startedInPageEvt: TraceEvent;
        navigationStartEvt: TraceEvent;
        firstPaintEvt: TraceEvent;
        firstContentfulPaintEvt: TraceEvent;
        firstMeaningfulPaintEvt: TraceEvent;
        loadEvt: TraceEvent;
        domContentLoadedEvt: TraceEvent;
        fmpFellBack: boolean;
      }
    }
  }
}

// empty export to keep file a module
export {}
