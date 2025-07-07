import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { CircularProgress, Button, Select, MenuItem, FormControl } from '@mui/material';
import ServiceForm from './StartPage';
import ServiceHeader from './ServiceHeader';
import RuleTable from './RuleTable';
import axe from 'axe-core';
import Pa11yTable from './Pa11yTable';
import { API_URL } from './constants';

function App() {
  const [rules, setRules] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [serviceId, setServiceId] = useState(localStorage.getItem("service_id") || "");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState("axe"); // State to toggle between axe and pa11y
  const [pa11yRules, setPa11yRules] = useState([]);
  const [ignoredRules, setIgnoredRules] = useState([]); // State for ignored rules

  const handleServiceId = (serviceId) => {
    localStorage.setItem("service_id", serviceId);
    setServiceId(serviceId);
    setShowForm(false);
  };

  useEffect(() => {
    if (serviceId && serviceId !== "") {
      async function fetchRule() {
        setLoading(true);
        try {
          const initialSelectedRows = [];

          const ruleIds = await axios.get(`${API_URL}/rules/${serviceId}`);
          const ignoreRuleIdsResponse = await axios.get(`${API_URL}/ignore-pa11y-rules/${serviceId}`);
          const ignoreRuleIdsData = ignoreRuleIdsResponse.data;
          const ignoredRuleIdList = ignoreRuleIdsData && ignoreRuleIdsData.length > 0 ? ignoreRuleIdsData.split(",") : [];
          setIgnoredRules(ignoredRuleIdList);
          const manualFailedRuleIds = await axios.get(`${API_URL}/manual-failed-rule-ids/${serviceId}`);
          if (manualFailedRuleIds.data.manual_failed_rule_ids_pa11y) {
            const pa11yRulesData = manualFailedRuleIds.data.manual_failed_rule_ids_pa11y.map((rule) => ({
              rule: rule,
              id: rule,
            }));
            setPa11yRules(pa11yRulesData);
          }
          const ruleIdsArray = ruleIds.data.split(",");

          const axeRule = axe.getRules().map((rule) => {
            let ciStatus = 'Disabled';
            let manualStatus = 'Passed';
            if (rule.ruleId && ruleIdsArray.includes(rule.ruleId)) {
              ciStatus = 'Enabled';
              initialSelectedRows.push(rule.ruleId);
            }
            if (rule.tags.includes('wcag2aaa') || rule.tags.includes('wcag22aa') || rule.tags.includes('experimental') || rule.tags.includes("deprecated") || manualFailedRuleIds.data.manual_failed_rule_ids.length === 0) {
              manualStatus = 'Not tested';
            } else {
              if (manualFailedRuleIds.data.manual_failed_rule_ids.includes(rule.ruleId)) {
                manualStatus = 'Failed';
              }
            }

            return {
              ...rule,
              id: rule.ruleId,
              desc: rule.description,
              ci: ciStatus,
              manual: manualStatus,
            };
          });

          console.log(axeRule);
          setRules(axeRule);
          setRowSelectionModel(initialSelectedRows);
        } catch (error) {
          console.error("Error fetching rules:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchRule();
    }
  }, [serviceId]);

  const enableAllPassedManualTest = () => {
    const updatedRules = rules.map(rule => {
      if (rule.ci === 'Disabled' && rule.manual === 'Passed') {
        return { ...rule, ci: 'Enabled' };
      }
      return rule;
    });
    setRules(updatedRules);
    setRowSelectionModel(updatedRules.filter(rule => rule.ci === 'Enabled').map(rule => rule.id));
  };

  const hasDisabledPassedManualTest = rules.some(rule => rule.ci === 'Disabled' && rule.manual === 'Passed');

  const handleIgnoredRulesChange = async (newIgnoredRules) => {
    setIgnoredRules(newIgnoredRules);
    console.log('Ignored Rules:', newIgnoredRules);
    const data = {
      ruleIds: newIgnoredRules.join(","),
    }
    const updatedService = await axios.put(`${API_URL}/ignore-pa11y-rules/${serviceId}`, data);
    console.log('updatedService:', updatedService.data);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
      <h1>Accessibility Hub</h1>
      {
        serviceId && !showForm ? (
          <ServiceHeader serviceName={serviceId} setShowForm={setShowForm} />
        ) : (
          <ServiceForm handleServiceId={handleServiceId} />
        )
      }
      {
        loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <CircularProgress style={{ margin: 'auto' }} />
            <p>Loading rule configuration...</p>
          </div>
        ) : (
          serviceId && serviceId !== "" && rules && rules.length > 0 && !showForm && (
            <>
              <FormControl style={{ marginBottom: '20px', width: '200px', height: '40px' }}>
                {/* <InputLabel id="tool-select-label">Select Tool</InputLabel> */}
                <Select
                  labelId="tool-select-label"
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                >
                  <MenuItem value="axe">Axe Tool</MenuItem>
                  <MenuItem value="pa11y">Pa11y Tool</MenuItem>
                </Select>
              </FormControl>
              {selectedTool === "axe" ? (
                <>
                  {hasDisabledPassedManualTest && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={enableAllPassedManualTest}
                      style={{ marginBottom: '20px', width: 'fit-content' }}
                    >
                      Enable all rules that passed manual test
                    </Button>
                  )}
                  <RuleTable
                    serviceId={serviceId}
                    rules={rules}
                    rowSelectionModel={rowSelectionModel}
                    setRowSelectionModel={setRowSelectionModel}
                    setRules={setRules}
                  />
                </>
              ) : (
                <div>
                  {/* <h2>Pa11y Table</h2> */}
                  {/* Replace this with your Pa11y table implementation */}
                  <Pa11yTable
                    rules={pa11yRules}
                    ignoredRules={ignoredRules}
                    onIgnoredRulesChange={handleIgnoredRulesChange}
                  />
                </div>
              )}
            </>
          )
        )
      }
    </div>
  );
}

export default App;
