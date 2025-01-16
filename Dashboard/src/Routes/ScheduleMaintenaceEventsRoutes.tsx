import Loader from "../Components/Loader/Loader";
import ComponentProps from "../Pages/PageComponentProps";
import ScheduledMaintenancesLaoyut from "../Pages/ScheduledMaintenanceEvents/Layout";
import ScheduledMaintenanceViewLayout from "../Pages/ScheduledMaintenanceEvents/View/Layout";
import PageMap from "../Utils/PageMap";
import RouteMap, {
  RouteUtil,
  ScheduledMaintenanceEventsRoutePath,
} from "../Utils/RouteMap";
import Route from "Common/Types/API/Route";
import React, {
  FunctionComponent,
  LazyExoticComponent,
  ReactElement,
  Suspense,
  lazy,
} from "react";
import { Route as PageRoute, Routes } from "react-router-dom";

// Pages

const ScheduledMaintenanceEvents: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import(
    "../Pages/ScheduledMaintenanceEvents/ScheduledMaintenanceEvents"
  );
});
const ScheduledMaintenanceEventView: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/Index");
});
const ScheduledMaintenanceEventViewDelete: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/Delete");
});
const ScheduledMaintenanceEventViewOwner: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/Owners");
});
const ScheduledMaintenanceEventViewStateTimeline: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/StateTimeline");
});
const ScheduledMaintenanceEventInternalNote: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/InternalNote");
});
const ScheduledMaintenanceEventPublicNote: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/PublicNote");
});
const OngoingScheduledMaintenanceEvents: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/Ongoing");
});
const ScheduledMaintenanceEventsViewCustomFields: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/CustomFields");
});

const ScheduledMaintenanceEventViewDescription: LazyExoticComponent<
  FunctionComponent<ComponentProps>
> = lazy(() => {
  return import("../Pages/ScheduledMaintenanceEvents/View/Description");
});

const ScheduledMaintenanceEventsRoutes: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <Routes>
      <PageRoute path="/" element={<ScheduledMaintenancesLaoyut {...props} />}>
        <PageRoute
          index
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEvents
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_EVENTS] as Route
                }
              />
            </Suspense>
          }
        />
        <PageRoute
          path={
            ScheduledMaintenanceEventsRoutePath[
              PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS
            ] || ""
          }
          element={
            <Suspense fallback={Loader}>
              <OngoingScheduledMaintenanceEvents
                {...props}
                pageRoute={
                  RouteMap[
                    PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS
                  ] as Route
                }
              />
            </Suspense>
          }
        />
      </PageRoute>

      <PageRoute
        path={
          ScheduledMaintenanceEventsRoutePath[
            PageMap.SCHEDULED_MAINTENANCE_VIEW
          ] || ""
        }
        element={<ScheduledMaintenanceViewLayout {...props} />}
      >
        <PageRoute
          index
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventView
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_VIEW] as Route
                }
              />
            </Suspense>
          }
        />
        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_VIEW_CUSTOM_FIELDS,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventsViewCustomFields
                {...props}
                pageRoute={
                  RouteMap[
                    PageMap.SCHEDULED_MAINTENANCE_VIEW_CUSTOM_FIELDS
                  ] as Route
                }
              />
            </Suspense>
          }
        />
        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_VIEW_DELETE,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventViewDelete
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_VIEW_DELETE] as Route
                }
              />
            </Suspense>
          }
        />

<PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_VIEW_DESCRIPTION,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventViewDescription
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_VIEW_DESCRIPTION] as Route
                }
              />
            </Suspense>
          }
        />

        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_VIEW_OWNERS,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventViewOwner
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_VIEW_OWNERS] as Route
                }
              />
            </Suspense>
          }
        />

        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_VIEW_STATE_TIMELINE,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventViewStateTimeline
                {...props}
                pageRoute={
                  RouteMap[
                    PageMap.SCHEDULED_MAINTENANCE_VIEW_STATE_TIMELINE
                  ] as Route
                }
              />
            </Suspense>
          }
        />

        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_INTERNAL_NOTE,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventInternalNote
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_INTERNAL_NOTE] as Route
                }
              />
            </Suspense>
          }
        />

        <PageRoute
          path={RouteUtil.getLastPathForKey(
            PageMap.SCHEDULED_MAINTENANCE_PUBLIC_NOTE,
          )}
          element={
            <Suspense fallback={Loader}>
              <ScheduledMaintenanceEventPublicNote
                {...props}
                pageRoute={
                  RouteMap[PageMap.SCHEDULED_MAINTENANCE_PUBLIC_NOTE] as Route
                }
              />
            </Suspense>
          }
        />
      </PageRoute>
    </Routes>
  );
};

export default ScheduledMaintenanceEventsRoutes;
