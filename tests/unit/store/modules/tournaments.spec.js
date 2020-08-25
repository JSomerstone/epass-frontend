import tournaments from "@/store/modules/tournaments";
import Vuex from "vuex";
import localVue from "../../localVue";
import { notifyException, successMessage, warningMessage } from '@/utils/notificationUtils';
import { API } from "aws-amplify";
jest.mock("aws-amplify");
jest.mock("@/utils/notificationUtils");

const success = (query, result = {}) => () => {
  let data = {};
  data[query] = result;
  return Promise.resolve({ data })
}
const failure = () => () => Promise.reject({ message: "Forced failure" });

describe("Module: tournaments", () => {

  let store;
  beforeEach(() => {
    tournaments.state = {
      loading: false,
      tournaments: [],
      filteredTournaments: [],
      selectedTournaments: [],
      filter: { show: "own" },
      wip: null,
      showTournamentForm: false,
      teams: [],
      debug: false
    };

    store = new Vuex.Store({
      modules: { tournaments }
    });
  });

  it("/setLoading changes the state", () => {
    store.dispatch("tournaments/setLoading", { loading: true });
    expect(tournaments.state.loading).toBe(true);
  });


  it("/addComment calls onSuccess", async () => {
    let result = { mocked: true };
    let onSuccess = jest.fn();
    API.graphql.mockImplementationOnce( success("createComment", result) );
    await store.dispatch("tournaments/addComment", { comment: {}, onSuccess });
    expect(onSuccess).toHaveBeenCalledWith(result);
  });

  it("/addComment notifies about exception", async () => {
    let onSuccess = jest.fn();
    API.graphql.mockImplementationOnce(failure());
    await store.dispatch("tournaments/addComment", { comment: {}, onSuccess });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(notifyException).toHaveBeenCalled();

  });
});