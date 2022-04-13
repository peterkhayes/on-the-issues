import React from "react";
import classNames from "classnames";
import styles from "./App.module.css";
import { useHash } from "react-use";
import _TOPIC_DATA from "./topics.json";
import Highlighter from "react-highlight-words";

interface TopicData {
  topic: string;
  keywords: string[];
  exclude?: string[];
  references: { text: string; keywords: string[] }[];
}

const TOPIC_DATA: TopicData[] = _TOPIC_DATA;

export default function App() {
  const [hash] = useHash();
  const selectedTopicId = hash.replace("#", "");
  const selectedTopicData = TOPIC_DATA.find(
    ({ topic }) => getTopicId(topic) === selectedTopicId
  );

  return (
    <div className={styles.content}>
      <header>
        <h1 className={styles.header}>On The Issues</h1>
        <div className={styles.topics}>
          {TOPIC_DATA.map(({ topic }) => {
            const id = getTopicId(topic);
            return (
              <a
                className={classNames(
                  styles.topic,
                  id === selectedTopicId && styles.selectedTopic
                )}
                href={`#${id}`}
              >
                {topic}
              </a>
            );
          })}
        </div>
      </header>
      {selectedTopicData && <Responses topicData={selectedTopicData} />}
    </div>
  );
}

function Responses({ topicData }: { topicData: TopicData }) {
  return (
    <section className={styles.columns}>
      <div className={styles.column}>
        <h2 className={styles.header}>Me and My Friends</h2>
      </div>
      <div className={styles.column}>
        <h2 className={styles.header}>
          <a href="https://www.uschamber.com/" target="_blank" rel="noreferrer">
            The US Chamber of Commerce
          </a>
        </h2>
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <strong>Keywords: </strong>
            {topicData.keywords.join(", ")}
          </div>
          {topicData.exclude && (
            <div className={styles.metadataItem}>
              <strong>Excluding: </strong>
              {topicData.exclude.join(", ")}
            </div>
          )}
        </div>
        {topicData.references.map(({ text }, i) => (
          <blockquote key={i}>
            <Highlighter
              highlightClassName={styles.keywordMatch}
              searchWords={topicData.keywords}
              autoEscape={true}
              textToHighlight={text}
            />
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function getTopicId(topic: string) {
  return topic.toLowerCase().replace(/(\s+|-)/g, "_");
}
