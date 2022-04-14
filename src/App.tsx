import React from "react";
import ReactModal from "react-modal";
import classNames from "classnames";
import styles from "./App.module.css";
import { useHash } from "react-use";
import {
  FRIEND_OPINIONS,
  COC_OPINIONS,
  Topic,
  TOPICS,
  TopicOpinions,
  TOPIC_NAMES,
} from "./data";
import Highlighter from "react-highlight-words";

export default function App() {
  const [modalOpen, setModalOpen] = React.useState(false);

  const [hash] = useHash();
  const selectedTopicId = hash.replace("#", "");
  const selectedTopic = TOPICS.find((t) => getTopicId(t) === selectedTopicId);

  return (
    <div className={styles.content}>
      <header>
        <h1 className={styles.header}>
          On The Issues
          {selectedTopic && <span>: {TOPIC_NAMES[selectedTopic]}</span>}
        </h1>
        <button
          className={styles.modalTrigger}
          onClick={() => setModalOpen(true)}
        >
          ?
        </button>
        <div className={styles.topics}>
          {TOPICS.map((topic) => {
            const id = getTopicId(topic);
            return (
              <a
                className={classNames(
                  styles.topic,
                  id === selectedTopicId && styles.selectedTopic
                )}
                href={`#${id}`}
              >
                {TOPIC_NAMES[topic]}
              </a>
            );
          })}
        </div>
      </header>
      {selectedTopic && <TopicDisplay topic={selectedTopic} />}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        overlayClassName={styles.modalOverlay}
        className={styles.modal}
      >
        <h2>About</h2>
        <p>
          The US Chamber of Commerce is, in their own words:
          <blockquote>
            <em>
              ...the world’s largest business organization. Our members range
              from the small businesses and chambers of commerce across the
              country that support their communities, to the leading industry
              associations and global corporations that innovate and solve for
              the world’s challenges, to the emerging and fast-growing
              industries that are shaping the future. For all of the businesses
              we represent, the Chamber is an advocate, partner, and network,
              helping them improve society and people’s lives.{" "}
            </em>
          </blockquote>
          As a result, the Chamber frequently expresses and advocates for
          positions that I find immoral.
        </p>
        <p>
          For this project, I selected a set of topics I had opinions about. I
          surveyed some of my friends as well as my classmates at{" "}
          <a href="https://sfpc.io/" target="_blank" rel="noreferrer">
            SFPC
          </a>{" "}
          to see how they felt about these topics.
        </p>
        <p>
          I also scraped all blog articles available on{" "}
          <a
            href="https://www.uschamber.com/topics"
            target="_blank"
            rel="noreferrer"
          >
            the "topics" section of the Chamber's website
          </a>
          , in order to get their views. The Chamber's views were extracted by
          processing the text of these articles, and finding lines matching
          keywords associated with the topics.
        </p>
        <p>
          I thought the juxtaposition of these opinions might be interesting.
        </p>
      </ReactModal>
    </div>
  );
}

function TopicDisplay({ topic }: { topic: Topic }) {
  return (
    <section className={styles.columns}>
      <OpinionsList
        title="My Friends and Classmates"
        opinions={FRIEND_OPINIONS[topic]}
      />
      <OpinionsList
        title={
          <a href="https://www.uschamber.com/" target="_blank" rel="noreferrer">
            The US Chamber of Commerce
          </a>
        }
        opinions={COC_OPINIONS[topic]}
      />
    </section>
  );
}

function OpinionsList({
  title,
  opinions,
}: {
  title: React.ReactNode;
  opinions: TopicOpinions;
}) {
  const { responses, keywords, excludedKeywords } = opinions;
  return (
    <div className={styles.column}>
      <h2 className={styles.header}>{title}</h2>
      <div className={styles.metadata}>
        {keywords && keywords.length > 0 && (
          <div className={styles.metadataItem}>
            <strong>Keywords: </strong>
            {keywords.join(", ")}
          </div>
        )}
        {excludedKeywords && excludedKeywords.length > 0 && (
          <div className={styles.metadataItem}>
            <strong>Excluding: </strong>
            {excludedKeywords.join(", ")}
          </div>
        )}
      </div>
      {responses.map((text, i) => (
        <blockquote key={i}>
          {keywords ? (
            <Highlighter
              highlightClassName={styles.keywordMatch}
              searchWords={keywords}
              autoEscape={true}
              textToHighlight={text}
            />
          ) : (
            text
          )}
        </blockquote>
      ))}
    </div>
  );
}

function getTopicId(topic: string) {
  return topic.toLowerCase().replace(/(\s+|-)/g, "_");
}
